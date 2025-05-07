import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("Has the expected column headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;
    const reviews = menuItemReviewFixtures.menuItemReviews;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={reviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = [
      "id",
      "Item ID",
      "Reviewer Email",
      "Stars",
      "Date Reviewed",
      "Comments",
      "Edit",
      "Delete",
    ];
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByRole("columnheader", { name: headerText });
      expect(header).toBeInTheDocument();
    });

    // Check first review data using specific test IDs for cells
    expect(
      screen.getByTestId("MenuItemReviewTable-cell-row-0-col-id")
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")
    ).toHaveTextContent("1"); // Check itemId specifically
    expect(
      screen.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")
    ).toHaveTextContent("shiyuanwang@ucsb.edu");
    expect(
      screen.getByTestId("MenuItemReviewTable-cell-row-0-col-stars")
    ).toHaveTextContent("5");
    expect(
      screen.getByTestId("MenuItemReviewTable-cell-row-0-col-dateReviewed")
    ).toHaveTextContent("2024-02-14T12:00:00");
    expect(
      screen.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")
    ).toHaveTextContent("Excellent item! Very tasty and well-prepared.");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const reviews = menuItemReviewFixtures.menuItemReviews;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={reviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button")
      ).toBeInTheDocument();
    });

    const editButton = screen.getByTestId(
      "MenuItemReviewTable-cell-row-0-col-Edit-button"
    );
    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/menuitemreview/edit/1")
    );
  });

  test("Edit and Delete buttons are not present for ordinary user", async () => {
    const currentUser = currentUserFixtures.userOnly;
    const reviews = menuItemReviewFixtures.menuItemReviews;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={reviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button")
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button")
      ).not.toBeInTheDocument();
    });
  });

  test("Edit and Delete buttons have correct variants for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const reviews = menuItemReviewFixtures.menuItemReviews;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewTable reviews={reviews} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const editButton = await screen.findByTestId(
      "MenuItemReviewTable-cell-row-0-col-Edit-button"
    );
    const deleteButton = await screen.findByTestId(
      "MenuItemReviewTable-cell-row-0-col-Delete-button"
    );

    // Bootstrap v5 uses btn-primary and btn-danger for variants
    expect(editButton.className).toMatch(/btn-primary/);
    expect(deleteButton.className).toMatch(/btn-danger/);
  });
});
