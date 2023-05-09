module.exports = {
    routes: [
//apply Opportunity
      {
        method: "POST",
        path: "/rating",
        handler: "custom.rating",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "GET",
        path: "/getRating/:oid/:uid",
        handler: "custom.getRating",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
};