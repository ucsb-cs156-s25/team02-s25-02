import React from "react";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse as _HttpResponse } from "msw";

export default {
  title: "components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable",
  component: UCSBDiningCommonsMenuItemTable,
};

const Template = (args) => <UCSBDiningCommonsMenuItemTable {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  menuItems: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.args = {
  menuItems: ucsbDiningCommonsMenuItemFixtures.threeMenuItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  menuItems: ucsbDiningCommonsMenuItemFixtures.threeMenuItems,
  currentUser: currentUserFixtures.adminUser,
};
ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitem", (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({ message: "Menu item deleted successfully" }),
      ),
    ),
  ],
};
