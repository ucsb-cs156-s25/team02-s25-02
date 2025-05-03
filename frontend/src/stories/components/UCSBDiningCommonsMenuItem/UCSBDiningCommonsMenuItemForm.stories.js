import React from "react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";

export default {
  title: "components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm",
  component: UCSBDiningCommonsMenuItemForm,
};

const Template = (args) => <UCSBDiningCommonsMenuItemForm {...args} />;

export const Create = Template.bind({});
Create.args = {
  initialContents: {},
  submitAction: (data) => console.log("Create form submitted", data),
  buttonLabel: "Create",
};

export const Update = Template.bind({});
Update.args = {
  initialContents: {
    id: 1,
    diningCommonsCode: "ortega",
    name: "Tacos",
    station: "Main Station",
  },
  submitAction: (data) => console.log("Update form submitted", data),
  buttonLabel: "Update",
};
