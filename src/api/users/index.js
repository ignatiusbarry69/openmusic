const UserHandler = require("./handler.js");
const routes = require("./routes.js");

const userPlugin = {
  name: "users",
  version: "1.0.0",
  register: async function (server, { service, validator }) {
    const userHandler = new UserHandler(service, validator);
    server.route(routes(userHandler));
  },
};

module.exports = userPlugin;
