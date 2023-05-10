module.exports = {
    routes: [
      {
        method: "GET",
        path: "/viewOrganization/:oid/:uid",
        handler: "organization-controller.viewOrganization",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
}