import React from "react";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReview/MenuItemReviewTable",
  component: MenuItemReviewTable,
};

const Template = (args) => {
  return <MenuItemReviewTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  reviews: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeReviewsOrdinaryUser = Template.bind({});
ThreeReviewsOrdinaryUser.args = {
  reviews: menuItemReviewFixtures.menuItemReviews,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeReviewsAdminUser = Template.bind({});
ThreeReviewsAdminUser.args = {
  reviews: menuItemReviewFixtures.menuItemReviews,
  currentUser: currentUserFixtures.adminUser,
};

ThreeReviewsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuitemreview", () => {
      return HttpResponse.json(
        { message: "MenuItemReview deleted successfully" },
        { status: 200 }
      );
    }),
  ],
};
