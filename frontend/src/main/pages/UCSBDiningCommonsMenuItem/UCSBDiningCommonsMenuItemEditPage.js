// src/main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage.js

import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router-dom";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({
  storybook = false,
}) {
  const { id } = useParams();

  const {
    data: menuItem,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbdiningcommonsmenuitem?id=${id}`],
    {
      method: "GET",
      url: "/api/ucsbdiningcommonsmenuitem",
      params: { id: Number(id) },
    },
    null, // <-- changed from [] to null
  );

  const objectToAxiosPutParams = (data) => ({
    url: "/api/ucsbdiningcommonsmenuitem",
    method: "PUT",
    params: { id: data.id }, // leave this so mutation spy kills the mutant
    data: {
      diningCommonsCode: data.diningCommonsCode,
      name: data.name,
      station: data.station,
    },
  });

  const onSuccess = (data) => {
    // use hyphen-minus here, not an en‑dash
    toast(
      `UCSBDiningCommonsMenuItem Updated - id: ${data.id} name: ${data.name}`,
    );
  };

  const mutation = useBackendMutation(objectToAxiosPutParams, { onSuccess }, [
    `/api/ucsbdiningcommonsmenuitem?id=${id}`,
  ]);

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitem" replace={true} />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDiningCommonsMenuItem</h1>
        {menuItem && (
          <UCSBDiningCommonsMenuItemForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={menuItem}
          />
        )}
      </div>
    </BasicLayout>
  );
}
