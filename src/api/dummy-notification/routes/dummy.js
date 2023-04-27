module.exports = {
    routes: [
      //dashboard fetch
      //find all the opportunities
      {
        method: "GET",
        path: "/notificationFind",
        handler: "dummy.notificationFind",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
}