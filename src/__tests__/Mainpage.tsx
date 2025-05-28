import { screen } from "@testing-library/react";
import MainPage from "@/app/page";
import { renderWithProvider } from "@/utils/test/renderWithProvider";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("MainPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProvider(<MainPage />);
  });

  it("Renders Home Page", () => {
    expect(screen.getByText("Task Flow")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /Task Flow/i })
    ).toBeInTheDocument();
  });

  it("renders the description paragraph", () => {
    expect(
      screen.getByText(/a modern web platform for task management/i)
    ).toBeInTheDocument();
  });

  it("renders the login section title", () => {
    expect(
      screen.getByRole("heading", { level: 3, name: /Log In/i })
    ).toBeInTheDocument();
  });

  it("renders the login form component", () => {
    const form = document.getElementById("login-form");
    expect(form).toBeInTheDocument();
  });

  it("renders the complete page structure", () => {
    // Check if the main elements are present
    expect(screen.getByRole("banner")).toBeInTheDocument(); // header
    expect(screen.getByRole("main")).toBeInTheDocument(); // main
    expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
  });

  it("renders header with correct text and styling", () => {
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("mx-auto", "flex", "max-w-2xl");
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("text-8xl", "bg-gradient-to-r");
    expect(title).toHaveTextContent("Task Flow");
  });

  it("renders the description with correct text and styling", () => {
    const description = screen.getByText(/A modern web platform/i);
    expect(description).toHaveClass("text-center", "text-lg");
    expect(description.textContent).toContain("Trello-style Kanban board");
  });

  it("renders the login section with correct structure", () => {
    const main = screen.getByRole("main");
    const section = main.querySelector("section");
    expect(section).toHaveClass("shadow-lg", "bg-[#f8fbff]");
    const loginTitle = screen.getByRole("heading", { level: 3 });
    expect(loginTitle).toHaveClass("text-2xl", "font-bold", "text-sky-900");
  });

  it("renders login form component", () => {
    const form = document.getElementById("login-form");
    expect(form).toBeInTheDocument();
    // Check if the form is inside the section
    const section = screen.getByRole("main").querySelector("section");
    expect(section).toContainElement(form);
  });

  it("renders footer component with copyright text", () => {
    expect(screen.getByText(/©.*Coded by/)).toBeInTheDocument();
    const footer = document.getElementById("main-footer");
    expect(footer).toBeInTheDocument();
  });
});
