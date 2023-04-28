module.exports = {
    routes: [
      //dashboard fetch
      //find by id
      {
        method: "GET",
        path: "/findOpportunity/:id1/:id2",
        handler: "opportunity-details.findOpportunity",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find Opportunity Details
      {
        method: "GET",
        path: "/findOpportunityDetails/:id",
        handler: "opportunity-details.findOpportunityDetails",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ],
  };