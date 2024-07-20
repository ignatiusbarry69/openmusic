const routes = function (handler) {
  return [
    {
      method: "POST",
      path: "/collaborations",
      handler: handler.postCollaborationHandler,
      options: {
        auth: "openmusic_jwt",
      },
    },
    {
      method: "DELETE",
      path: "/collaborations",
      handler: handler.deleteCollaborationHandler,
      options: {
        auth: "openmusic_jwt",
      },
    },
  ];
};

module.exports = routes;
