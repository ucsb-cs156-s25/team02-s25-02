import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesCreatePage tests", () => {
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

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 1,
      title: "sample 1",
      url: "https://www.example.com/sample1",
      explanation: "sample 1 description",
      email: "email1@ucsb.edu",
      dateAdded: "2022-01-02T12:00:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("Url");
    expect(urlInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const dateAddedInput = screen.getByLabelText("Date Added");
    expect(dateAddedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: "sample 1" } });
    fireEvent.change(urlInput, {
      target: { value: "https://www.example.com/sample1" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "sample 1 description" },
    });
    fireEvent.change(emailInput, { target: { value: "email1@ucsb.edu" } });
    fireEvent.change(dateAddedInput, {
      target: { value: "2022-01-02T12:00:00" },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "sample 1",
      url: "https://www.example.com/sample1",
      explanation: "sample 1 description",
      email: "email1@ucsb.edu",
      dateAdded: "2022-01-02T12:00",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New article Created - id: 1 title: sample 1",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
  });
});
