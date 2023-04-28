module.exports = {
    routes: [
      //splash screen per fetch data
      //find top 5 new opportunities
      {
        method: "GET",
        path: "/findTopFive/:id",
        handler: "pre-fetch.findTopFive",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find top 5 ongoing and waiting opportunities
      {
        method: "GET",
        path: "/findTopFiveOngoing/:id",
        handler: "pre-fetch.findTopFiveOngoing",
        config: {
          policies: [],
          middleware: [],
        },
      },
      //find top 5 completed opportunities
      {
        method: "GET",
        path: "/findTopFiveCompleted/:id",
        handler: "pre-fetch.findTopFiveCompleted",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ],
  };