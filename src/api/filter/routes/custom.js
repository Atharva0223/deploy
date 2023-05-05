module.exports = {
  routes: [
    //find all the opportunities by filter
    {
      method: "GET",
      path: "/getStates",
      handler: "custom.states",
      config: {
        policies: [],
        middleware: [],
      },
    },
    {
      method: "GET",
      path: "/getTags",
      handler: "custom.tags",
      config: {
        policies: [],
        middleware: [],
      },
    },
    {
      method: "POST",
      path: "/addFilters",
      handler: "custom.addFilters",
      config: {
        policies: [],
        middleware: [],
      },
    },
  ],
};