import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>
    );
    expect(await screen.findByText(/Item ID/)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email/)).toBeInTheDocument();
    expect(screen.getByText(/Stars/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed/)).toBeInTheDocument();
    expect(screen.getByText(/Comments/)).toBeInTheDocument();
  });

  test("when I click submit, the right things happen", async () => {
    const submitSpy = jest.fn();
    render(
      <Router>
        <MenuItemReviewForm submitAction={submitSpy} />
      </Router>
    );

    const expectedReview = {
      itemId: "1",
      reviewerEmail: "test@test.com",
      stars: 5,
      dateReviewed: "2024-02-14T12:00",
      comments: "Great food!",
    };

    const itemIdField = screen.getByLabelText(/Item ID/);
    const reviewerEmailField = screen.getByLabelText(/Reviewer Email/);
    const starsField = screen.getByLabelText(/Stars/);
    const dateReviewedField = screen.getByLabelText(/Date Reviewed/);
    const commentsField = screen.getByLabelText(/Comments/);
    const submitButton = screen.getByText(/Create/);

    fireEvent.change(itemIdField, { target: { value: expectedReview.itemId } });
    fireEvent.change(reviewerEmailField, {
      target: { value: expectedReview.reviewerEmail },
    });
    fireEvent.change(starsField, { target: { value: expectedReview.stars } });
    fireEvent.change(dateReviewedField, {
      target: { value: expectedReview.dateReviewed },
    });
    fireEvent.change(commentsField, {
      target: { value: expectedReview.comments },
    });

    fireEvent.click(submitButton);

    await waitFor(() => expect(submitSpy).toHaveBeenCalled());

    expect(submitSpy).toHaveBeenCalledWith(expectedReview);
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>
    );
    const cancelButton = screen.getByText(/Cancel/);
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>
    );

    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Item ID is required./);
    expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Stars rating is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();

    const itemIdField = screen.getByLabelText(/Item ID/);
    const reviewerEmailField = screen.getByLabelText(/Reviewer Email/);
    const starsField = screen.getByLabelText(/Stars/);

    fireEvent.change(itemIdField, { target: { value: 0 } });
    fireEvent.change(reviewerEmailField, {
      target: { value: "invalid-email" },
    });
    fireEvent.change(starsField, { target: { value: 6 } });

    fireEvent.click(submitButton);

    await screen.findByText(/Item ID must be at least 1./);
    expect(
      screen.getByText(/Invalid email address format./)
    ).toBeInTheDocument();
    expect(screen.getByText(/Stars must be at most 5./)).toBeInTheDocument();
  });

  test("that the form is pre-populated with initial contents", async () => {
    const initialContents = menuItemReviewFixtures.oneMenuItemReview;
    render(
      <Router>
        <MenuItemReviewForm initialContents={initialContents} />
      </Router>
    );

    expect(screen.getByTestId("MenuItemReviewForm-id")).toBeInTheDocument();
    expect(screen.getByTestId("MenuItemReviewForm-id")).toHaveValue(
      initialContents.id.toString()
    );
    expect(screen.getByTestId("MenuItemReviewForm-id")).toBeDisabled();
  });
});
