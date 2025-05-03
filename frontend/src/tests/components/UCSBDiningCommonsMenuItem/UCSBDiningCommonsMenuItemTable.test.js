import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

// mock toast inside jest.mock to avoid hoisting issues
const mockToast = jest.fn();
jest.mock("react-toastify", () => ({
  toast: (msg) => mockToast(typeof msg === "string" ? msg : msg.message),
}));

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemTable tests", () => {
  const queryClient = new QueryClient();
  const testId = "UCSBDiningCommonsMenuItemTable";

  beforeEach(() => {
    // reset toast and navigate between tests
    mockToast.mockClear();
    mockedNavigate.mockClear();
  });

  test("renders without crashing for ordinary user", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeMenuItems}
            currentUser={currentUserFixtures.userOnly}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Dining Commons Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();

    expect(screen.getByText("ortega")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("has buttons and correct content for admin user", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeMenuItems}
            currentUser={currentUserFixtures.adminUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("Dining Commons Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`),
    ).toHaveTextContent("ortega");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`),
    ).toHaveTextContent("Tacos");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-station`),
    ).toHaveTextContent("Main Station");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("edit button navigates to edit page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeMenuItems}
            currentUser={currentUserFixtures.adminUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/ucsbdiningcommonsmenuitems/edit/2",
      ),
    );
  });

  test("delete button triggers backend call, invalidates query, and shows toast", async () => {
    // Spy on invalidateQueries to kill the arrayDeclaration and stringLiteral mutants
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitem")
      .reply(200, { message: "deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemTable
            menuItems={ucsbDiningCommonsMenuItemFixtures.threeMenuItems}
            currentUser={currentUserFixtures.adminUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });

    // ✅ kills the invalidation array mutant and string literal mutant
    expect(invalidateSpy).toHaveBeenCalledWith([
      "/api/ucsbdiningcommonsmenuitem/all",
    ]);

    // ✅ kills the onSuccess object mutant
    expect(mockToast).toHaveBeenCalledWith("deleted");
  });
});
