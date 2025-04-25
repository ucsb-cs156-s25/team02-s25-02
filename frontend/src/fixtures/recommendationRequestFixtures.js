const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "evania@ucsb.edu",
    professorEmail: "prof@ucsb.edu",
    explanation: "sample explanation",
    dateRequested: "2022-01-02T12:00:00",
    dateNeeded: "2022-01-12T12:00:00",
    done: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "sample1@ucsb.edu",
      professorEmail: "prof1@ucsb.edu",
      explanation: "sample explanation 1",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "2022-01-12T12:00:00",
      done: true,
    },
    {
      id: 2,
      requesterEmail: "sample2@ucsb.edu",
      professorEmail: "prof2@ucsb.edu",
      explanation: "sample explanation 2",
      dateRequested: "2023-01-02T12:00:00",
      dateNeeded: "2023-01-12T12:00:00",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "sample3@ucsb.edu",
      professorEmail: "prof3@ucsb.edu",
      explanation: "sample explanation 3",
      dateRequested: "2025-01-02T12:00:00",
      dateNeeded: "2025-01-12T12:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
