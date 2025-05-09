import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: helprequest,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/helprequest?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/helprequest`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (helprequest) => ({
    url: "/api/helprequest",
    method: "PUT",
    params: {
      id: helprequest.id,
    },
    data: {
      requesterEmail: helprequest.requesterEmail,
      teamId: helprequest.teamId,
      tableOrBreakoutRoom: helprequest.tableOrBreakoutRoom,
      requestTime: helprequest.requestTime,
      explanation: helprequest.explanation,
      solved: helprequest.solved,
    },
  });

  const onSuccess = (helprequest) => {
    toast(
      `Help Request Updated - id: ${helprequest.id} requester email: ${helprequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/helprequest?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Help Request</h1>
        {helprequest && (
          <HelpRequestForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={helprequest}
          />
        )}
      </div>
    </BasicLayout>
  );
}
