const helpRequestFixtures = {
  onehelpRequest: [
    {
      id: 1,
      requesterEmail: "ayalawang@ucsb.edu",
      teamId: "02",
      tableOrBreakoutRoom: "room1",
      requestTime: "2022-01-03T00:00:00",
      explanation: "need help on branching",
      solved: "true",
    },
  ],
  threehelpRequests: [
    {
      id: 1,
      requesterEmail: "ayalawang@ucsb.edu",
      teamId: "02",
      tableOrBreakoutRoom: "room1",
      requestTime: "2022-01-03T00:00:00",
      explanation: "need help on branching",
      solved: "true",
    },
    {
      id: 2,
      requesterEmail: "ayalawang@ucsb.edu",
      teamId: "02",
      tableOrBreakoutRoom: "02",
      requestTime: "2022-01-03T00:00:00",
      explanation: "need help on branching",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "shiyuanwang@ucsb.edu",
      teamId: "02",
      tableOrBreakoutRoom: "02",
      requestTime: "2022-01-03T00:00:00",
      explanation: "Can I get help at table 02",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };
