import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures.js";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestFixtures.oneRequest}
        />
      </Router>,
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-cancel");

    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.change(professorEmailField, { target: { value: "bad-input" } });
    fireEvent.change(explanationField, { target: { value: "bad-input" } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-input" } });
    fireEvent.change(dateNeededField, { target: { value: "bad-input" } });
    fireEvent.change(doneField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/requesterEmail is required./);
    expect(screen.getByText(/professorEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/dateRequested is required./)).toBeInTheDocument();
    expect(screen.getByText(/dateNeeded is required./)).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "student@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
      {
        target: { value: "professor@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-explanation"),
      {
        target: { value: "Grad school recommendation" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
      {
        target: { value: "2024-05-01T10:00" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
      {
        target: { value: "2024-05-10T12:00" },
      },
    );
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-done"), {
      target: { value: "false" },
    });

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-cancel");
    const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
