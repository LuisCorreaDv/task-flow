import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainForm from "../components/MainForm";
import { renderWithProvider } from "../utils/test/renderWithProvider";

// Mocking the Next.js router to control navigation in tests
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("MainForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProvider(<MainForm />);
  });

  it("renders login form with all elements", () => {
    // Form should be in the document
    expect(document.getElementById("login-form")).toBeInTheDocument();

    // Inputs for email and password
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Submit button
    const submitButton = screen.getByRole("button", { name: /login/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });
  it("shows validation errors for empty fields", async () => {
    // Empty email and password fields
    const submitButton = screen.getByRole("button", { name: /login/i });
    await userEvent.click(submitButton);

    // Error messages should be displayed
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Please enter a password")).toBeInTheDocument();
    });
  });
  it("shows validation error for invalid email", async () => {
    // Invalid email input
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, "invalid-email");

    // Try to submit the form
    const submitButton = screen.getByRole("button", { name: /login/i });
    await userEvent.click(submitButton);

    // Verifying error message for invalid email
    await waitFor(() => {
      expect(
        screen.getByText("Pleaase enter a valid email")
      ).toBeInTheDocument();
    });
  });

  it("accepts valid email format", async () => {
    // Valid email
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await userEvent.type(screen.getByLabelText(/password/i), "password123"); // No debería mostrar error de email inválido
    expect(
      screen.queryByText("Pleaase enter a valid email")
    ).not.toBeInTheDocument();
  });
});
