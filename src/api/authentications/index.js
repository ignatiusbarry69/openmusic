const AuthenticationsHandler = require("./handler.js");
const routes = require("./routes.js");

const authenticationsPlugin = {
  name: "authentications",
  version: "1.0.0",
  register: async function (
    server,
    { authenticationsService, usersService, tokenManager, validator }
  ) {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    );

    server.route(routes(authenticationsHandler));
  },
};

module.exports = authenticationsPlugin;
