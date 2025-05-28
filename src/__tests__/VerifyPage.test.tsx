import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifyPage from "../app/Verify/page";
import { renderWithProvider } from "../utils/test/renderWithProvider";

// Mock the verification slice actions
const mockGenerateVerificationCode = jest.fn();
const mockVerifyCode = jest.fn();
const mockClearError = jest.fn();
const mockResetVerification = jest.fn();

jest.mock("../redux/features/verificationSlice", () => ({
  __esModule: true,
  default: (
    state = {
      code: null,
      loading: false,
      error: null,
      verificationPassed: false,
    }
  ) => state,
  generateVerificationCode: () => mockGenerateVerificationCode,
  verifyCode: () => mockVerifyCode,
  clearError: () => mockClearError,
  resetVerification: () => mockResetVerification,
}));

// Mocking the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("VerifyPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProvider(<VerifyPage />);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders verification page correctly", () => {
    // Check main elements
    expect(
      screen.getByRole("heading", { name: /enter verification code/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/6-digit code/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /verify code/i })
    ).toBeInTheDocument();
  });

  it("handles form validation", async () => {
    const verifyButton = screen.getByRole("button", { name: /verify code/i });
    const codeInput = screen.getByPlaceholderText(/6-digit code/i);

    // Test empty field
    await userEvent.click(verifyButton);
    expect(await screen.findByText("Code is required")).toBeInTheDocument();

    // Test invalid code
    await userEvent.type(codeInput, "12345");
    await userEvent.click(verifyButton);
    expect(
      await screen.findByText("Code must be 6 digits")
    ).toBeInTheDocument();

    // Test valid code
    await userEvent.clear(codeInput);
    await userEvent.type(codeInput, "123456");
    expect(screen.queryByText("Code must be 6 digits")).not.toBeInTheDocument();
  });
  it("generates verification code on mount", () => {
    expect(mockGenerateVerificationCode).toHaveBeenCalled();
  });
});
