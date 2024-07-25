const ExportsHandler = require("./handler.js");
const routes = require("./routes.js");

const exportsPlugin = {
  name: "exports",
  version: "1.0.0",
  register: async (server, { exportsService, playlistService, validator }) => {
    const exportsHandler = new ExportsHandler(
      exportsService,
      playlistService,
      validator
    );
    server.route(routes(exportsHandler));
  },
};

module.exports = exportsPlugin;
