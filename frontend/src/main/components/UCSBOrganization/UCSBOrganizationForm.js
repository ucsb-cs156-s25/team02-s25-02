import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function UCSBOrganizationForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "UCSBOrganizationForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgcode">OrgCode</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgcode"}
          id="orgcode"
          type="text"
          isInvalid={Boolean(errors.orgCode)}
          {...register("orgCode", {
            required: "OrgCode is required.",
            maxLength: {
              value: 10,
              message: "Max length 10 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgCode?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* <Form.Group className="mb-3">
        <Form.Label htmlFor="orgcode">OrgCode</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgcode"}
          id="orgcode"
          type="text"
          isInvalid={Boolean(errors.orgCode)}
          {...register("orgCode", {
            required: "OrgCode is required.",
            maxLength: {
              value: 10,
              message: "Max length 10 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgCode?.message}
        </Form.Control.Feedback>
      </Form.Group> */}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgtranslationshort">
          OrgTranslationShort
        </Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgtranslationshort"}
          id="orgtranslationshort"
          type="text"
          isInvalid={Boolean(errors.orgTranslationShort)}
          {...register("orgTranslationShort", {
            required: "OrgTranslationShort is required.",
            maxLength: {
              value: 30,
              message: "Max length 30 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslationShort?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgtranslation">OrgTranslation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgtranslation"}
          id="orgtranslation"
          type="text"
          isInvalid={Boolean(errors.orgTranslation)}
          {...register("orgTranslation", {
            required: "OrgTranslation is required.",
            maxLength: {
              value: 30,
              message: "Max length 50 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="inactive">Inactive (unchecked = false)</Form.Label>
        <Form.Check
          data-testid={testIdPrefix + "-inactive"}
          type="checkbox"
          id="inactive"
          {...register("inactive")}
        />
      </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UCSBOrganizationForm;
