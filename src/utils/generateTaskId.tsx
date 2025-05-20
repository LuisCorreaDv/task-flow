export function generateTaskId(userId: string): string {
    const date = Date.now();
    const raw = `${date}-${userId}-${Math.random().toString(36).substring(2, 10)}`;
    return btoa(raw).replace(/=/g, '');
}
