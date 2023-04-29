module.exports = {
    routes: [
      //GET all the bookmarked opportunity
      {
        method: "GET",
        path: "/saved/:id",
        handler: "save-controller.saved",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "DELETE",
        path: "/unsave/:id1/:id2",
        handler: "save-controller.unsave",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "POST",
        path: "/save/:id1/:id2",
        handler: "save-controller.save",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
}