module.exports = {
    routes: [
      //delete An Opportunity
      {
        method: "DELETE",
        path: "/delete/:id",
        handler: "delete.delete",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ],
  };