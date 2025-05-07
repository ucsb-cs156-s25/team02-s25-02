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
      </Router>,
    );
    expect(await screen.findByText(/Item ID/)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email/)).toBeInTheDocument();
    expect(screen.getByText(/Stars/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed/)).toBeInTheDocument();
    expect(screen.getByText(/Comments/)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    const cancelButton = screen.getByText(/Cancel/);
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
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
      screen.getByText(/Invalid email address format./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Stars must be at most 5./)).toBeInTheDocument();
  });

  test("that the form is pre-populated with initial contents", async () => {
    const initialContents = menuItemReviewFixtures.oneMenuItemReview;
    render(
      <Router>
        <MenuItemReviewForm initialContents={initialContents} />
      </Router>,
    );

    expect(screen.getByTestId("MenuItemReviewForm-id")).toBeInTheDocument();
    expect(screen.getByTestId("MenuItemReviewForm-id")).toHaveValue(
      initialContents.id.toString(),
    );
    expect(screen.getByTestId("MenuItemReviewForm-id")).toBeDisabled();
  });

  test("Stars field handles numeric input correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    const starsField = screen.getByLabelText(/Stars/);
    const submitButton = screen.getByText(/Create/);

    // Test valid input
    fireEvent.change(starsField, { target: { value: 3 } });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(
        screen.queryByText(/Stars must be at most 5./),
      ).not.toBeInTheDocument(),
    );

    // Test invalid input (below min)
    fireEvent.change(starsField, { target: { value: 0 } });
    fireEvent.click(submitButton);
    await screen.findByText(/Stars must be at least 1./);

    // Test invalid input (above max)
    fireEvent.change(starsField, { target: { value: 6 } });
    fireEvent.click(submitButton);
    await screen.findByText(/Stars must be at most 5./);

    // Test non-numeric input
    fireEvent.change(starsField, { target: { value: "not-a-number" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Stars rating is required./);
  });

  test("Reviewer Email field validates regex pattern", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    const reviewerEmailField = screen.getByLabelText(/Reviewer Email/);
    const submitButton = screen.getByText(/Create/);

    // Test valid email
    fireEvent.change(reviewerEmailField, {
      target: { value: "test@test.com" },
    });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(
        screen.queryByText(/Invalid email address format./),
      ).not.toBeInTheDocument(),
    );

    // Test invalid email
    fireEvent.change(reviewerEmailField, {
      target: { value: "invalid-email" },
    });
    fireEvent.click(submitButton);
    await screen.findByText(/Invalid email address format./);
  });

  test("Date Reviewed field validates regex pattern", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    const dateReviewedField = screen.getByLabelText(/Date Reviewed/);
    const submitButton = screen.getByText(/Create/);

    // Test valid date
    fireEvent.change(dateReviewedField, {
      target: { value: "2024-02-14T12:00" },
    });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(
        screen.queryByText(/Invalid date\/time format./),
      ).not.toBeInTheDocument(),
    );

    // Test invalid date
    fireEvent.change(dateReviewedField, { target: { value: "not-a-date" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Date Reviewed is required./);
  });

  test("shows error for invalid email format", async () => {
    render(<MenuItemReviewForm submitAction={jest.fn()} />);

    const emailInput = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Invalid email address format./);
  });

  test("itemId input treats input as number due to valueAsNumber", async () => {
    const mockSubmit = jest.fn();
    render(<MenuItemReviewForm submitAction={mockSubmit} />);

    fireEvent.change(screen.getByTestId("MenuItemReviewForm-itemId"), {
      target: { value: "42" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-reviewerEmail"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-stars"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-dateReviewed"), {
      target: { value: "2023-12-01T12:00" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-comments"), {
      target: { value: "Great!" },
    });

    fireEvent.click(screen.getByTestId("MenuItemReviewForm-submit"));

    await waitFor(() =>
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: 42, // number, not string
        }),
        expect.anything(),
      ),
    );
  });

  test("shows error when stars input is not between 1 and 5", async () => {
    render(<MenuItemReviewForm submitAction={jest.fn()} />);

    fireEvent.change(screen.getByTestId("MenuItemReviewForm-stars"), {
      target: { value: "6" },
    });
    fireEvent.click(screen.getByTestId("MenuItemReviewForm-submit"));

    await screen.findByText(/Stars must be at most 5./);
  });

  test("shows error when non-numeric string entered into itemId", async () => {
    render(<MenuItemReviewForm submitAction={jest.fn()} />);

    fireEvent.change(screen.getByTestId("MenuItemReviewForm-itemId"), {
      target: { value: "abc" }, // not a number
    });
    fireEvent.click(screen.getByTestId("MenuItemReviewForm-submit"));

    await screen.findByText(/Item ID is required./);
  });

  test("shows error for email without @", async () => {
    await renderFormWithInvalidEmail("foobar.com");
  });

  test("shows error for email without domain", async () => {
    await renderFormWithInvalidEmail("foo@");
  });

  test("shows error for email with invalid chars", async () => {
    await renderFormWithInvalidEmail("foo@bar@baz");
  });

  // Helper
  async function renderFormWithInvalidEmail(badEmail) {
    render(<MenuItemReviewForm submitAction={jest.fn()} />);

    fireEvent.change(screen.getByTestId("MenuItemReviewForm-reviewerEmail"), {
      target: { value: badEmail },
    });

    fireEvent.click(screen.getByTestId("MenuItemReviewForm-submit"));

    await screen.findByText(/Invalid email address format./);
  }
});
