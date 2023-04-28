module.exports = {
  routes: [
    //dashboard fetch
    //find all the opportunities
    {
      method: "GET",
      path: "/find",
      handler: "dashboard.find",
      config: {
        policies: [],
        middleware: [],
      },
    },
    //view Ongoing
    {
      method: "GET",
      path: "/viewOngoing/:id",
      handler: "dashboard.viewOngoing",
      config: {
        policies: [],
        middleware: [],
      },
    },
    //view Completed
    {
      method: "GET",
      path: "/viewCompleted/:id",
      handler: "dashboard.viewCompleted",
      config: {
        policies: [],
        middleware: [],
      },
    },
  ],
};
