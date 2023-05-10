module.exports = {
    routes: [
      {
        method: "GET",
        path: "/viewOrganization/:id",
        handler: "organization-controller.viewOrganization",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
}