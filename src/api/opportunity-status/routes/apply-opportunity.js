module.exports = {
    routes: [
//apply Opportunity
      {
        method: "GET",
        path: "/getApply/:id",
        handler: "apply-opportunity.getApply",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
};