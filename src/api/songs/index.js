const routes = require("./routes.js");
const SongHandler = require("./handler.js");

const songPlugin = {
  name: "songs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  },
};

module.exports = songPlugin;
