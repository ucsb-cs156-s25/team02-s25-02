import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({ id: 42 }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {
  describe("when backend GET times out", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 42 } })
        .timeout();
    });

    const queryClient = new QueryClient();

    test("renders header but no form fields", async () => {
      const restore = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit UCSBDiningCommonsMenuItem");
      expect(
        screen.queryByTestId("UCSBDiningCommonsMenuItemForm-id"),
      ).not.toBeInTheDocument();

      restore();
    });
  });

  describe("when backend returns an item", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.adminUser);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      // return an item with id=42 to match useParams()
      axiosMock
        .onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 42 } })
        .reply(200, {
          id: 42,
          diningCommonsCode: "de-la-guerra",
          name: "Spaghetti",
          station: "Entrees",
        });
      // simulate update returning new name
      axiosMock.onPut("/api/ucsbdiningcommonsmenuitem").reply(200, {
        id: 42,
        diningCommonsCode: "de-la-guerra",
        name: "Burritos",
        station: "Entrees",
      });
    });

    const queryClient = new QueryClient();

    test("form is populated and update works", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // wait for form to appear
      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const codeField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-station",
      );
      const submit = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

      // initial values from GET
      expect(idField).toHaveValue("42");
      expect(codeField).toHaveValue("de-la-guerra");
      expect(nameField).toHaveValue("Spaghetti");
      expect(stationField).toHaveValue("Entrees");

      // change name and submit
      fireEvent.change(nameField, { target: { value: "Burritos" } });
      fireEvent.click(submit);

      // verify PUT request carried correct params & data
      await waitFor(() => {
        expect(axiosMock.history.put.length).toBe(1);
        expect(axiosMock.history.put[0].params).toEqual({ id: 42 });
        expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
          diningCommonsCode: "de-la-guerra",
          name: "Burritos",
          station: "Entrees",
        });
      });

      // toast expectations
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          "UCSBDiningCommonsMenuItem Updated - id: 42 name: Burritos",
        );
      });

      // navigate expectations
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/diningcommonsmenuitem",
          replace: true,
        });
      });
    });

    test("calls useBackend and useBackendMutation with correct parameters", async () => {
      const useBackendSpy = jest.spyOn(
        require("main/utils/useBackend"),
        "useBackend",
      );
      const useBackendMutationSpy = jest.spyOn(
        require("main/utils/useBackend"),
        "useBackendMutation",
      );

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // wait for hook to be called
      await waitFor(() => expect(useBackendSpy).toHaveBeenCalled());

      // verify useBackend parameters
      expect(useBackendSpy).toHaveBeenCalledWith(
        [`/api/ucsbdiningcommonsmenuitem?id=42`],
        {
          method: "GET",
          url: "/api/ucsbdiningcommonsmenuitem",
          params: { id: 42 },
        },
        null,
      );

      // verify the query key passed into useBackendMutation
      const mutationArgs = useBackendMutationSpy.mock.calls[0];
      expect(mutationArgs[2]).toEqual([`/api/ucsbdiningcommonsmenuitem?id=42`]);
    });
  });
});
