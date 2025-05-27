import { NextRequest } from "next/server";

// Store active SSE connections
const clients = new Map<string, WritableStreamDefaultWriter<Uint8Array>>();

type EventData = {
  type: string;
  time?: number;
  taskId?: string;
  status?: string;
};

// Send event to specific user
const sendToUser = async (
  userId: string,
  data: EventData,
  event: string = "message"
) => {
  const writer = clients.get(userId);
  if (writer) {
    const encoder = new TextEncoder();
    await writer.write(
      encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    );
  }
};

/**
 * SSE endpoint for real-time task updates
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Store the client connection
  clients.set(userId, writer);

  // Send keep-alive every 30 seconds
  const keepAlive = setInterval(async () => {
    await sendToUser(userId, { type: "ping", time: Date.now() });
  }, 30000);

  // Clean up on connection close
  req.signal.addEventListener("abort", () => {
    clearInterval(keepAlive);
    clients.delete(userId);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * Handle task update events
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    // Broadcast the event to the specific user
    await sendToUser(userId, data, data.type);

    return new Response("Event sent", { status: 200 });
  } catch (error) {
    console.error("Error processing event:", error);
    return new Response("Error processing event", { status: 500 });
  }
}
