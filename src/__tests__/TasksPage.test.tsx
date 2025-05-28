import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TasksPage from "../app/tasks/page";
import { renderWithProvider } from "../utils/test/renderWithProvider";

describe("TasksPage Component", () => {
  beforeEach(() => {
    renderWithProvider(<TasksPage />);
  });
  it("renders tasks page components correctly", () => {
    // Check that main components are rendered
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument(); // Search input
    expect(document.getElementById("status-filter")).toBeInTheDocument(); // Status filter button
    expect(screen.getByLabelText(/favorites/i)).toBeInTheDocument(); // Favorites checkbox
  });
  it("handles search functionality", async () => {
    const searchInput = screen.getByPlaceholderText(/search tasks/i);

    // Type in search field
    await userEvent.type(searchInput, "test task");
    expect(searchInput).toHaveValue("test task");

    // Find the submit button (search icon)
    expect(document.getElementById("search-tasks")).toBeInTheDocument();
  });
  it("handles status filter changes", async () => {
    // Open the dropdown
    const statusButtons = screen.getAllByRole("button", { name: /all/i });
    const statusButton = statusButtons.find((button) =>
      button.className.includes("rounded-s-lg")
    );
    if (!statusButton) throw new Error("Status filter button not found");
    await userEvent.click(statusButton);

    // Change status filter to completed
    const completedOption = screen.getByText(/completed/i);
    await userEvent.click(completedOption);
    expect(statusButton).toHaveTextContent(/completed/i); // Reopen dropdown and select on going
    await userEvent.click(statusButton);
    const onGoingOption = screen.getByText(/on going/i);
    await userEvent.click(onGoingOption);
    expect(statusButton).toHaveTextContent(/on going/i);

    // Reopen dropdown and select urgent
    await userEvent.click(statusButton);
    const urgentOption = screen.getByText(/urgent/i);
    await userEvent.click(urgentOption);
    expect(statusButton).toHaveTextContent(/urgent/i);
  });
  it("handles favorites filter", async () => {
    const favoritesCheckbox = screen.getByRole("checkbox", {
      name: /favorites/i,
    });

    // Enable favorites filter
    await userEvent.click(favoritesCheckbox);
    expect(favoritesCheckbox).toBeChecked();

    // Disable favorites filter
    await userEvent.click(favoritesCheckbox);
    expect(favoritesCheckbox).not.toBeChecked();
  });
});
