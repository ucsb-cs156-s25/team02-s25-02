import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  const testIdPrefix = "UCSBDiningCommonsMenuItemForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    expect(await screen.findByText("Dining Commons Code")).toBeInTheDocument();
    expect(screen.getByText("Menu Item Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();
  });

  test("renders correctly with initialContents", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm
          initialContents={ucsbDiningCommonsMenuItemFixtures.oneMenuItem[0]}
        />
      </Router>,
    );

    expect(await screen.findByTestId(`${testIdPrefix}-id`)).toBeInTheDocument();
    expect(screen.getByDisplayValue("de-la-guerra")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Spaghetti")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Entrees")).toBeInTheDocument();
  });

  test("validations show error messages on empty input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    const submitButton = screen.getByText("Create");
    fireEvent.click(submitButton);

    await screen.findByText("Dining Commons Code is required.");
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Station is required.")).toBeInTheDocument();
  });

  test("submitAction is called with correct data on valid input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );

    fireEvent.change(screen.getByTestId(`${testIdPrefix}-diningCommonsCode`), {
      target: { value: "ortega" },
    });
    fireEvent.change(screen.getByTestId(`${testIdPrefix}-name`), {
      target: { value: "Tacos" },
    });
    fireEvent.change(screen.getByTestId(`${testIdPrefix}-station`), {
      target: { value: "Main Station" },
    });

    const submitButton = screen.getByTestId(`${testIdPrefix}-submit`);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(mockSubmitAction).toHaveBeenCalledWith(
      {
        diningCommonsCode: "ortega",
        name: "Tacos",
        station: "Main Station",
      },
      expect.anything(),
    );
  });

  test("navigates back when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    const cancelButton = screen.getByTestId(`${testIdPrefix}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("has correct data-testid for submit button", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    expect(
      screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit"),
    ).toBeInTheDocument();
  });
});
