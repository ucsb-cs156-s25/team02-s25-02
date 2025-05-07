const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 1,
    reviewerEmail: "shiyuanwang@ucsb.edu",
    stars: 5,
    dateReviewed: "2024-02-14T12:00:00",
    comments: "Excellent item! Very tasty and well-prepared.",
  },
  menuItemReviews: [
    {
      id: 1,
      itemId: 1,
      reviewerEmail: "shiyuanwang@ucsb.edu",
      stars: 5,
      dateReviewed: "2024-02-14T12:00:00",
      comments: "Excellent item! Very tasty and well-prepared.",
    },
    {
      id: 2,
      itemId: 1,
      reviewerEmail: "shiyuanwang@ucsb.edu",
      stars: 4,
      dateReviewed: "2024-02-14T13:00:00",
      comments: "Good item, but could use more seasoning.",
    },
    {
      id: 3,
      itemId: 2,
      reviewerEmail: "shiyuanwang@ucsb.edu",
      stars: 3,
      dateReviewed: "2024-02-14T14:00:00",
      comments: "Average item, nothing special.",
    },
    {
      id: 4,
      itemId: 2,
      reviewerEmail: "shiyuanwang@ucsb.edu",
      stars: 5,
      dateReviewed: "2024-02-14T15:00:00",
      comments: "Amazing item! Best I've ever had.",
    },
  ],
};

export { menuItemReviewFixtures };
