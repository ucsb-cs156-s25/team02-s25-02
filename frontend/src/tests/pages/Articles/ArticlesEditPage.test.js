import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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

describe("ArticlesEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-name")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "sample 1",
        url: "https://www.example.com/sample1",
        explanation: "sample 1 description",
        email: "email1@ucsb.edu",
        dateAdded: "2022-01-02T12:00:00",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "sample 2",
        url: "https://www.example.com/sample2",
        explanation: "sample 2 description",
        email: "email2@ucsb.edu",
        dateAdded: "2022-04-03T12:00:00",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      // const titleField = screen.getByTestId("ArticleForm-title");
      // const urlField = screen.getByTestId("ArticleForm-url");
      // const explanationField = screen.getByTestId("ArticleForm-explanation");
      // const emailField = screen.getByTestId("ArticleForm-email");
      // const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
      // const submitButton = screen.getByTestId("ArticleForm-submit");

      const titleField = screen.getByLabelText("Title");
      const urlField = screen.getByLabelText("Url");
      const explanationField = screen.getByLabelText("Explanation");
      const emailField = screen.getByLabelText("Email");
      const dateAddedField = screen.getByLabelText("Date Added");
      const submitButton = screen.getByRole("button", { name: "Update" });

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue("sample 1");
      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue("https://www.example.com/sample1");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("sample 1 description");
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("email1@ucsb.edu");
      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2022-01-02T12:00");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "sample 2" },
      });
      fireEvent.change(urlField, {
        target: { value: "https://www.example.com/sample2" },
      });
      fireEvent.change(explanationField, {
        target: { value: "sample 2 description" },
      });
      fireEvent.change(emailField, {
        target: { value: "email2@ucsb.edu" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2022-04-03T12:00:00" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 17 title: sample 2",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "sample 2",
          url: "https://www.example.com/sample2",
          explanation: "sample 2 description",
          email: "email2@ucsb.edu",
          dateAdded: "2022-04-03T12:00",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      // const titleField = screen.getByTestId("ArticleForm-title");
      // const urlField = screen.getByTestId("ArticleForm-url");
      // const explanationField = screen.getByTestId("ArticleForm-explanation");
      // const emailField = screen.getByTestId("ArticleForm-email");
      // const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");

      const titleField = screen.getByLabelText("Title");
      const urlField = screen.getByLabelText("Url");
      const explanationField = screen.getByLabelText("Explanation");
      const emailField = screen.getByLabelText("Email");
      const dateAddedField = screen.getByLabelText("Date Added");
      const submitButton = screen.getByRole("button", { name: "Update" });

      // const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("sample 1");
      expect(urlField).toHaveValue("https://www.example.com/sample1");
      expect(explanationField).toHaveValue("sample 1 description");
      expect(emailField).toHaveValue("email1@ucsb.edu");
      expect(dateAddedField).toHaveValue("2022-01-02T12:00");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(titleField, {
        target: { value: "sample 2" },
      });
      fireEvent.change(urlField, {
        target: { value: "https://www.example.com/sample2" },
      });
      fireEvent.change(explanationField, {
        target: { value: "sample 2 description" },
      });
      fireEvent.change(emailField, {
        target: { value: "email2@ucsb.edu" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2022-04-03T12:00:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 17 title: sample 2",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
    });
  });
});
