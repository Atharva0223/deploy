module.exports = {
    routes: [
      //dashboard fetch
      //find all the opportunities
      {
        method: "GET",
        path: "/findByFilter",
        handler: "filters.find",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ],
  };