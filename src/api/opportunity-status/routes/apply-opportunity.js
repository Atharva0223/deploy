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
      {
        method: "DELETE",
        path: "/unapply/:oid/:uid",
        handler: "apply-opportunity.unapply",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
};