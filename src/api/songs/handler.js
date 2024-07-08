const ClientError = require("../../exceptions/ClientError.js");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const {
        title,
        year,
        genre,
        performer,
        duration = null,
        albumId = null,
      } = request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      return h
        .response({
          status: "success",
          data: {
            songId,
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
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }

  async getSongsHandler(request, h) {
    try {
      const { title = null, performer = null } = request.query;
      const songs = await this._service.getSongs(title, performer);
      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      console.error(error);
      return h
        .response({
          status: "error",
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);

      return {
        status: "success",
        data: {
          song,
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

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const {
        title,
        year,
        genre,
        performer,
        duration = null,
        albumId = null,
      } = request.payload;

      await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      return {
        status: "success",
        message: "Musik berhasil diperbarui",
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
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this._service.deleteSongById(id);

      return {
        status: "success",
        message: "Musik berhasil dihapus",
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
          message: "Unlucky, try again later.",
        })
        .code(500);
    }
  }
}

module.exports = SongHandler;
