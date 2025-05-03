import { render, screen, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { useBackend } from "main/utils/useBackend";
import { useCurrentUser, hasRole, useLogout } from "main/utils/currentUser";
import { useSystemInfo } from "main/utils/systemInfo";

jest.mock("main/utils/useBackend");
jest.mock("main/utils/currentUser");
jest.mock("main/utils/systemInfo");

describe("UCSBDiningCommonsMenuItemIndexPage mutation‑killing tests", () => {
  const queryClient = new QueryClient();

  function renderPage() {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  }

  beforeEach(() => {
    useLogout.mockReturnValue({ mutate: jest.fn() });
    useSystemInfo.mockReturnValue({ data: {} });
    // handle both shapes: either user or user.data passed in
    hasRole.mockImplementation((user, role) => {
      const roles = user?.data?.roles ?? user?.roles ?? [];
      return roles.includes(role);
    });
  });

  test("Admin sees Create button and hasRole must be called with ROLE_ADMIN", async () => {
    // useCurrentUser returns query result with .data
    const adminQuery = { data: { roles: ["ROLE_ADMIN"] } };
    useCurrentUser.mockReturnValue(adminQuery);
    useBackend.mockReturnValue({ data: [], error: null, status: "success" });

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByText("Create UCSBDiningCommonsMenuItem"),
      ).toBeInTheDocument();
    });

    const btn = screen.getByText("Create UCSBDiningCommonsMenuItem");
    expect(btn).toHaveAttribute("href", "/diningcommonsmenuitem/create");
    expect(btn).toHaveStyle({ float: "right" });

    expect(hasRole).toHaveBeenCalledWith(
      // first call from AppNavbar: receives unwrapped currentUser.data
      { roles: ["ROLE_ADMIN"] },
      "ROLE_ADMIN",
    );
    expect(hasRole).toHaveBeenCalledWith(
      // second call from createButton: receives the query result
      adminQuery,
      "ROLE_ADMIN",
    );
  });

  test("Non-admin does not see Create button but hasRole must still be called", async () => {
    const userQuery = { data: { roles: ["ROLE_USER"] } };
    useCurrentUser.mockReturnValue(userQuery);
    useBackend.mockReturnValue({ data: [], error: null, status: "success" });

    renderPage();

    await waitFor(() => {
      expect(
        screen.queryByText("Create UCSBDiningCommonsMenuItem"),
      ).not.toBeInTheDocument();
    });

    expect(hasRole).toHaveBeenCalledWith(
      { roles: ["ROLE_USER"] },
      "ROLE_ADMIN",
    );
    expect(hasRole).toHaveBeenCalledWith(userQuery, "ROLE_ADMIN");
  });

  test("Table displays multiple items and hasRole still uses ROLE_ADMIN", async () => {
    const userQuery = { data: { roles: ["ROLE_USER"] } };
    useCurrentUser.mockReturnValue(userQuery);

    const items = [
      { id: 1, name: "A", station: "S1", url: "u1" },
      { id: 2, name: "B", station: "S2", url: "u2" },
      { id: 3, name: "C", station: "S3", url: "u3" },
    ];
    useBackend.mockReturnValue({ data: items, error: null, status: "success" });

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-id"),
      ).toHaveTextContent("1");
    });
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-1-col-id"),
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-2-col-id"),
    ).toHaveTextContent("3");

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();

    expect(hasRole).toHaveBeenCalledWith(
      { roles: ["ROLE_USER"] },
      "ROLE_ADMIN",
    );
    expect(hasRole).toHaveBeenCalledWith(userQuery, "ROLE_ADMIN");
  });

  test("useBackend is called with correct arguments", () => {
    useCurrentUser.mockReturnValue({ data: { roles: ["ROLE_USER"] } });
    useBackend.mockClear();
    useBackend.mockReturnValue({ data: [], error: null, status: "success" });

    renderPage();

    expect(useBackend).toHaveBeenCalledWith(
      ["/api/ucsbdiningcommonsmenuitem/all"],
      { method: "GET", url: "/api/ucsbdiningcommonsmenuitem/all" },
      [],
    );
  });
});
