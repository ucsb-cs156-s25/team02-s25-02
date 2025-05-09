import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HelpRequestIndexPage from "main/pages/HelpRequests/HelpRequestIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("HelpRequestIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "HelpRequestTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders with Create Button for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/helprequest/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create Help Request/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create Help Request/);
    expect(button).toHaveAttribute("href", "/helprequest/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders three help requests correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/helprequest/all")
      .reply(200, helpRequestFixtures.threehelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );

    const createButton = screen.queryByText("Create Help Request");
    expect(createButton).not.toBeInTheDocument();

    // // const requesterEmail = screen.getByText("ayalawang@ucsb.edu");
    // // expect(requesterEmail).toBeInTheDocument();

    // const requesterEmails = screen.getAllByText("ayalawang@ucsb.edu");
    // expect(requesterEmails.length).toBe(2); // Adjust count as needed

    // const teamId = screen.getByText("02");
    // expect(teamId).toBeInTheDocument();

    // const tableOrBreakoutRoom = screen.getByText("room1");
    // expect(tableOrBreakoutRoom).toBeInTheDocument();

    // const requestTime = screen.getByText("2022-01-03T00:00:00");
    // expect(requestTime).toBeInTheDocument();

    // const explanation = screen.getByText("need help on branching");
    // expect(explanation).toBeInTheDocument();

    // const solved = screen.getByText("true");
    // expect(solved).toBeInTheDocument();

    // expect(description).toBeInTheDocument();

    // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
    expect(
      screen.queryByTestId("RestaurantTable-cell-row-0-col-Delete-button"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("RestaurantTable-cell-row-0-col-Edit-button"),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    axiosMock.onGet("/api/helprequest/all").timeout();

    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/helprequest/all",
    );
    restoreConsole();
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();

    axiosMock
      .onGet("/api/helprequest/all")
      .reply(200, helpRequestFixtures.threehelpRequests);
    axiosMock
      .onDelete("/api/helprequest")
      .reply(200, "Help Request with id 1 was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toBeCalledWith("Help Request with id 1 was deleted");
    });

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe("/api/helprequest");
    expect(axiosMock.history.delete[0].url).toBe("/api/helprequest");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});

// import { render, screen } from "@testing-library/react";
// import HelpRequestIndexPage from "main/pages/HelpRequests/HelpRequestIndexPage";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { MemoryRouter } from "react-router-dom";
// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

// jest.mock("main/utils/currentUser");
// jest.mock("main/utils/systemInfo");

// import { currentUser } from "main/utils/currentUser";
// import { systemInfo } from "main/utils/systemInfo";

// describe("HelpRequestIndexPage tests", () => {
//   const queryClient = new QueryClient();

//   beforeEach(() => {
//     currentUser.get = jest.fn(() => apiCurrentUserFixtures.userOnly);
//     systemInfo.get = jest.fn(() => systemInfoFixtures.showingNeither);
//   });

//   test("renders three help requests correctly for regular user", async () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <HelpRequestIndexPage />
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     // assert that all emails are in the document
//     const emailCells = screen.getAllByText("ayalawang@ucsb.edu");
//     expect(emailCells.length).toBe(2);

//     expect(screen.getByText("shiyuanwang@ucsb.edu")).toBeInTheDocument();
//     expect(screen.getByText("room1")).toBeInTheDocument();
//     expect(screen.getByText("Can I get help at table 02")).toBeInTheDocument();

//     // verify that admin-only button is NOT visible
//     expect(screen.queryByText("Create Help Request")).not.toBeInTheDocument();
//   });
// });
