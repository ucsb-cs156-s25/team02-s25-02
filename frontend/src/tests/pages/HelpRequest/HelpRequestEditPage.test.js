import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

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
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestEditPage tests", () => {
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequest-requesterEmail"),
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "ayalawang@ucsb.edu",
        teamId: "02",
        tableOrBreakoutRoom: "room1",
        requestTime: "2022-01-03T00:00",
        explanation: "need help on branching",
        solved: true,
      });
      axiosMock.onPut("/api/helprequest").reply(200, {
        id: 17,
        requesterEmail: "wangs557@gmail.com",
        teamId: "04",
        tableOrBreakoutRoom: "room12",
        requestTime: "2025-01-03T00:00",
        explanation: "skill issue git good",
        solved: "true",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");

      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("ayalawang@ucsb.edu");

      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("02");

      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("room1");

      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2022-01-03T00:00");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("need help on branching");

      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toHaveValue("true");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "wangs557@gmail.com" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "04" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "room12" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2025-01-03T00:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "skill issue git good" },
      });
      fireEvent.change(solvedField, {
        target: { value: "true" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request Updated - id: 17 requester email: wangs557@gmail.com",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          // id: 17,
          requesterEmail: "wangs557@gmail.com",
          teamId: "04",
          tableOrBreakoutRoom: "room12",
          requestTime: "2025-01-03T00:00",
          explanation: "skill issue git good",
          solved: true,
        }),
      ); // posted object
    });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <HelpRequestEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("HelpRequestForm-id");

    //   const idField = screen.getByTestId("HelpRequestForm-id");
    //   const nameField = screen.getByTestId("HelpRequestForm-name");
    //   const descriptionField = screen.getByTestId("HelpRequestForm-description");
    //   const submitButton = screen.getByTestId("HelpRequestForm-submit");

    //   expect(idField).toHaveValue("17");
    //   expect(nameField).toHaveValue("Freebirds");
    //   expect(descriptionField).toHaveValue("Burritos");
    //   expect(submitButton).toBeInTheDocument();

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toBeCalled());
    //   expect(mockToast).toBeCalledWith(
    //     "Help Request Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
    // });
  });
});
