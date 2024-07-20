const AuthenticationHandler = require("./handler.js");
const routes = require("./routes.js");

const authenticationPlugin = {
  name: "authentications",
  version: "1.0.0",
  register: async function (
    server,
    { authenticationService, userService, tokenManager, validator }
  ) {
    const authenticationHandler = new AuthenticationHandler(
      authenticationService,
      userService,
      tokenManager,
      validator
    );

    server.route(routes(authenticationHandler));
  },
};

module.exports = authenticationPlugin;
