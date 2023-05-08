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
    ]
};