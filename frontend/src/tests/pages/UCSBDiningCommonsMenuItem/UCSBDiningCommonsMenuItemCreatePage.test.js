import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock("react-toastify", () => ({
  toast: (msg) => mockToast(typeof msg === "string" ? msg : msg.message),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: (x) => {
    mockNavigate(x);
    return null;
  },
}));

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();

    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByLabelText("Dining Commons Code");
  });

  test("on submit, makes request, shows toast, navigates, and invalidates cache", async () => {
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const newItem = {
      id: 5,
      diningCommonsCode: "ortega",
      name: "Chicken Alfredo",
      station: "Entrees",
    };

    axiosMock.onPost("/api/ucsbdiningcommonsmenuitem/post").reply(202, newItem);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByLabelText("Dining Commons Code"), {
      target: { value: "ortega" },
    });
    fireEvent.change(screen.getByLabelText("Menu Item Name"), {
      target: { value: "Chicken Alfredo" },
    });
    fireEvent.change(screen.getByLabelText("Station"), {
      target: { value: "Entrees" },
    });

    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit",
    );
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "ortega",
      name: "Chicken Alfredo",
      station: "Entrees",
    });

    // kills the mutation string literal and arrayDeclaration mutants
    expect(invalidateSpy).toHaveBeenCalledWith([
      "/api/ucsbdiningcommonsmenuitem/all",
    ]);

    // kills toast text string mutant
    expect(mockToast).toHaveBeenCalledWith(
      "New menu item created - id: 5 name: Chicken Alfredo",
    );

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/diningcommonsmenuitem" });
  });
});
