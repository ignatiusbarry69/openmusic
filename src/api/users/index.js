const UsersHandler = require("./handler.js");
const routes = require("./routes.js");

const usersPlugin = {
  name: "users",
  version: "1.0.0",
  register: async function (server, { service, validator }) {
    const userHandler = new UsersHandler(service, validator);
    server.route(routes(userHandler));
  },
};

module.exports = usersPlugin;
