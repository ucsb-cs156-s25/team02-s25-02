import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationEditPage";

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
    useParams: () => ({
      orgCode: "ZPY",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
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
        .onGet("/api/ucsborganizations", { params: { orgCode: "ZPY" } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Organization");
      expect(
        screen.queryByTestId("UCSBOrganization-orgcode"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
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
        .onGet("/api/ucsborganizations", { params: { orgCode: "ZPY" } })
        .reply(200, {
          orgCode: "ZPY",
          orgTranslationShort: "ZETA PHI RHO",
          orgTranslation: "ZETA PHI RHO",
          inactive: true,
        });
      axiosMock.onPut("/api/ucsborganizations").reply(200, {
        orgCode: "ZPY",
        orgTranslationShort: "ZETA PHI RHO 222",
        orgTranslation: "ZETA PHI RHO 222",
        inactive: "false",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgcode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgcode");
      const orgTransShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgtranslationshort",
      );
      const orgTransField = screen.getByTestId(
        "UCSBOrganizationForm-orgtranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toBeInTheDocument();
      expect(orgCodeField).toHaveValue("ZPY");
      expect(orgTransShortField).toBeInTheDocument();
      expect(orgTransShortField).toHaveValue("ZETA PHI RHO");
      expect(orgTransField).toBeInTheDocument();
      expect(orgTransField).toHaveValue("ZETA PHI RHO");
      expect(inactiveField).toBeInTheDocument();
      expect(inactiveField).toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(orgTransShortField, {
        target: { value: "ZETA PHI RHO 222" },
      });
      fireEvent.change(orgTransField, {
        target: { value: "ZETA PHI RHO 222" },
      });

      fireEvent.click(inactiveField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Organization Updated - orgCode: ZPY",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/ucsborganizations" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ orgCode: "ZPY" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          orgCode: "ZPY",
          orgTranslationShort: "ZETA PHI RHO 222",
          orgTranslation: "ZETA PHI RHO 222",
          inactive: false,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgcode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgcode");
      const orgTransShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgtranslationshort",
      );
      const orgTransField = screen.getByTestId(
        "UCSBOrganizationForm-orgtranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toBeDisabled();
      expect(orgCodeField).toHaveValue("ZPY");
      expect(orgTransShortField).toHaveValue("ZETA PHI RHO");
      expect(orgTransField).toHaveValue("ZETA PHI RHO");
      expect(inactiveField).toBeInTheDocument();
      expect(inactiveField).toBeChecked();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(orgTransShortField, {
        target: { value: "ZETA PHI RHO 222" },
      });
      fireEvent.change(orgTransField, {
        target: { value: "ZETA PHI RHO 222" },
      });

      fireEvent.change(inactiveField, { target: { value: false } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Organization Updated - orgCode: ZPY",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsborganizations" });
    });
  });
});
