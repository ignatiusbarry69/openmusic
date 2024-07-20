const routes = require("./routes.js");
const PlaylistsHandler = require("./handler.js");

const playlistsPlugin = {
  name: "playlists",
  version: "1.0.0",
  register: async function (
    server,
    { playlistsService, songService, validator }
  ) {
    const playlistHandler = new PlaylistsHandler(
      playlistsService,
      songService,
      validator
    );
    server.route(routes(playlistHandler));
  },
};

module.exports = playlistsPlugin;
