const AlbumHandler = require("./handler.js");
const routes = require("./routes.js");

const albumPlugin = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { albumService, storageService, validator }) => {
    const albumHandler = new AlbumHandler(
      albumService,
      storageService,
      validator
    );
    server.route(routes(albumHandler));
  },
};

module.exports = albumPlugin;
