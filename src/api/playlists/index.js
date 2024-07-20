const routes = require("./routes.js");
const PlaylistHandler = require("./handler.js");

const playlistPlugin = {
  name: "playlists",
  version: "1.0.0",
  register: async function (
    server,
    { playlistService, songService, validator }
  ) {
    const playlistHandler = new PlaylistHandler(
      playlistService,
      songService,
      validator
    );
    server.route(routes(playlistHandler));
  },
};

module.exports = playlistPlugin;
