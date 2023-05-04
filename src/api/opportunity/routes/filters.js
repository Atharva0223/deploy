module.exports = {
    routes: [
      //find all the opportunities by filter
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