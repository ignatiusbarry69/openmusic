const ClientError = require("../../exceptions/ClientError.js");

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);

      const { username, password, fullname } = request.payload;

      const userId = await this._service.addUser({
        username,
        password,
        fullname,
      });

      return h
        .response({
          status: "success",
          message: "User berhasil ditambahkan",
          data: {
            userId,
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
}

module.exports = UserHandler;
