const routes = require("./routes.js");
const AlbumHandler = require("./handler.js");

const albumPlugin = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service, validator);
    server.route(routes(albumHandler));
  },
};

module.exports = albumPlugin;
