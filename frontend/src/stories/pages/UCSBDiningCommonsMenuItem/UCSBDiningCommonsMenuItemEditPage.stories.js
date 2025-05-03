// src/stories/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage.stories.js

import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

export default {
  title: "pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage",
  component: UCSBDiningCommonsMenuItemEditPage,
};

const Template = () => <UCSBDiningCommonsMenuItemEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/ucsbdiningcommonsmenuitem", (_req) => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemFixtures.oneMenuItem[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/ucsbdiningcommonsmenuitem", (_req) => {
      // echo back updated name
      return HttpResponse.json(
        {
          ...ucsbDiningCommonsMenuItemFixtures.oneMenuItem[0],
          name: "Updated Name",
        },
        { status: 200 },
      );
    }),
  ],
};
