const routes = require("./routes.js");
const CollaborationsHandler = require("./handler.js");

const collaborationPlugin = {
  name: "collaborations",
  version: "1.0.0",
  register: async function (
    server,
    { collaborationService, playlistService, userService, validator }
  ) {
    const collaborationHandler = new CollaborationsHandler(
      collaborationService,
      playlistService,
      userService,
      validator
    );
    server.route(routes(collaborationHandler));
  },
};

module.exports = collaborationPlugin;
