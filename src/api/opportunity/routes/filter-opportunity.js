module.exports = {
    routes: [
      //delete An Opportunity
      {
        method: "GET",
        path: "/getFiltersOpportunities",
        handler: "filter-opportunity.getFiltersOpportunities",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ],
  };