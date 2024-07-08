const ClientError = require("../../exceptions/ClientError.js");

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const payload = request.payload || {};
      const name = payload.name || null;
      const year = payload.year || null;

      const albumId = await this._service.addAlbum({ name, year });

      return h
        .response({
          status: "success",
          data: { albumId },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }

      console.error(error);
      return h
        .response({
          status: "error",
          message: "dddddduarrrrrghasda",
        })
        .code(500);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);

      return h.response({
        status: "success",
        data: {
          album,
        },
      });
    } catch (error) {
      console.error(error);
      const statusCode = error instanceof ClientError ? error.statusCode : 500;
      const errorMessage =
        error instanceof ClientError ? error.message : "ctarrrrr";

      return h
        .response({
          status: error instanceof ClientError ? "fail" : "error",
          message: errorMessage,
        })
        .code(statusCode);
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { id } = request.params;
      const { name, year } = request.payload;

      await this._service.editAlbumById(id, { name, year });

      return h.response({
        status: "success",
        message: "Album berhasil diperbarui",
      });
    } catch (error) {
      console.error(error);
      const statusCode = error instanceof ClientError ? error.statusCode : 500;
      const errorMessage =
        error instanceof ClientError ? error.message : "dorrrrrr";

      return h
        .response({
          status: error instanceof ClientError ? "fail" : "error",
          message: errorMessage,
        })
        .code(statusCode);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this._service.deleteAlbumById(id);

      return h.response({
        status: "success",
        message: "Album berhasil dihapus",
      });
    } catch (error) {
      console.error(error);
      const statusCode = error instanceof ClientError ? error.statusCode : 500;
      const errorMessage =
        error instanceof ClientError
          ? error.message
          : "dduarrrrrrrrrrrrrrrdhgh";

      return h
        .response({
          status: error instanceof ClientError ? "fail" : "error",
          message: errorMessage,
        })
        .code(statusCode);
    }
  }
}

module.exports = AlbumHandler;
