import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";

import { QueryClient, QueryClientProvider } from "react-query";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "OrgCode",
    "OrgTranslationShort",
    "OrgTranslation",
    "Inactive (unchecked = false)",
  ];
  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={ucsbOrganizationsFixtures.oneUCSBOrganization}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-inactive`)).toBeInTheDocument();

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    const inactiveInput = screen.getByTestId(`${testId}-inactive`);
    fireEvent.change(inactiveInput, { target: { checked: true } });

    fireEvent.click(submitButton);

    await screen.findByText(/OrgCode is required/);
    expect(
      screen.getByText(/OrgTranslationShort is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/OrgTranslation is required/)).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgcode`);
    fireEvent.change(orgCodeInput, { target: { value: "a".repeat(11) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 10 characters/)).toBeInTheDocument();
    });

    const orgTransShortInput = screen.getByTestId(
      `${testId}-orgtranslationshort`,
    );
    fireEvent.change(orgTransShortInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });

    const orgTransInput = screen.getByTestId(`${testId}-orgtranslation`);
    fireEvent.change(orgTransInput, { target: { value: "a".repeat(51) } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 50 characters/)).toBeInTheDocument();
    });
  });
});
