const ClientError = require("../../exceptions/ClientError.js");

class AlbumHandler {
  constructor(albumService, storageService, validator) {
    this._albumService = albumService;
    this._storageService = storageService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);

    this.postLikeAlbumByIdHandler = this.postLikeAlbumByIdHandler.bind(this);
    this.getAlbumLikesByIdHandler = this.getAlbumLikesByIdHandler.bind(this);
    this.deleteAlbumLikesByIdHandler =
      this.deleteAlbumLikesByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { name, year } = request.payload;
      const albumId = await this._albumService.addAlbum({ name, year });

      return h
        .response({
          status: "success",
          data: {
            albumId,
          },
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
          message: "Unlucky, try again later",
        })
        .code(500);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._albumService.getAlbumById(id);

      return {
        status: "success",
        data: {
          album,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: "error",
        message: "Unlucky, try again later.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { id } = request.params;
      const { name, year } = request.payload;

      await this._albumService.editAlbumById(id, { name, year });

      return {
        status: "success",
        message: "Album berhasil diperbarui",
      };
    } catch (error) {
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
          message: "Unlucky, try again later",
        })
        .code(500);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this._albumService.deleteAlbumById(id);

      return {
        status: "success",
        message: "Album berhasil dihapus",
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
  async postAlbumCoverHandler(request, h) {
    try {
      const { id } = request.params;
      const { cover } = request.payload;
      this._validator.validateAlbumCoverHeaders(cover.hapi.headers);

      const url = await this._storageService.writeFile(cover, cover.hapi);
      await this._albumService.editAlbumCoverById(id, url);

      return h
        .response({
          status: "success",
          message: "Sampul berhasil diunggah",
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

  async postLikeAlbumByIdHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._albumService.getAlbumById(albumId);
      await this._albumService.addAlbumLikeById(albumId, userId);

      return h
        .response({
          status: "success",
          message: "Operasi berhasil dilakukan",
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

  async getAlbumLikesByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { cache, likes } = await this._albumService.getAlbumLikesById(id);

      const response = h.response({
        status: "success",
        data: {
          likes,
        },
      });

      if (cache) {
        response.header("X-Data-Source", "cache");
      }
      return response;
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      return h
        .response({
          status: "error",
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }

  async deleteAlbumLikesByIdHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._albumService.deleteAlbumLikeById(albumId, userId);

      return h
        .response({
          status: "success",
          message: "Like berhasil dihapus",
        })
        .code(200);
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

module.exports = AlbumHandler;
