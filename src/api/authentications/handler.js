const ClientError = require("../../exceptions/ClientError.js");

class AuthenticationHandler {
  constructor(authenticationsService, userService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      const id = await this._userService.verifyUserCredential(
        username,
        password
      );

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      return h
        .response({
          status: "success",
          message: "Authentication berhasil ditambahkan",
          data: {
            accessToken,
            refreshToken,
          },
        })
        .code(201);
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }

      return h
        .response({
          status: "error",
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: "success",
        message: "Berhasil memperbarui Access Token ",
        data: {
          accessToken,
        },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }

      return h
        .response({
          status: "error",
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: "success",
        message: "Refresh Token berhasil dihapus",
      };
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }

      return h
        .response({
          status: "error",
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }
}

module.exports = AuthenticationHandler;
