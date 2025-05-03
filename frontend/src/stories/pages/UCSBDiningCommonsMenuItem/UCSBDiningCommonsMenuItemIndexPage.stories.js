import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";

export default {
  title: "pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage",
  component: UCSBDiningCommonsMenuItemIndexPage,
};

const Template = () => <UCSBDiningCommonsMenuItemIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    http.get("/api/ucsbdiningcommonsmenuitem/all", () =>
      HttpResponse.json([], { status: 200 }),
    ),
  ],
};

export const OneItemOrdinaryUser = Template.bind({});
OneItemOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    http.get("/api/ucsbdiningcommonsmenuitem/all", () =>
      HttpResponse.json(ucsbDiningCommonsMenuItemFixtures.oneMenuItem, {
        status: 200,
      }),
    ),
  ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.userOnly, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    http.get("/api/ucsbdiningcommonsmenuitem/all", () =>
      HttpResponse.json(ucsbDiningCommonsMenuItemFixtures.threeMenuItems, {
        status: 200,
      }),
    ),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () =>
      HttpResponse.json(apiCurrentUserFixtures.adminUser, { status: 200 }),
    ),
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingNeither, { status: 200 }),
    ),
    http.get("/api/ucsbdiningcommonsmenuitem/all", () =>
      HttpResponse.json(ucsbDiningCommonsMenuItemFixtures.threeMenuItems, {
        status: 200,
      }),
    ),
    http.delete("/api/ucsbdiningcommonsmenuitem", () =>
      HttpResponse.json(
        { message: "Menu item deleted successfully" },
        { status: 200 },
      ),
    ),
  ],
};
