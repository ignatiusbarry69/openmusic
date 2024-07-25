const ClientError = require("../../exceptions/ClientError.js");

class PlaylistHandler {
  constructor(playlistService, songService, validator) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postPlaylistSongByIdHandler =
      this.postPlaylistSongByIdHandler.bind(this);
    this.getPlaylistSongsByIdHandler =
      this.getPlaylistSongsByIdHandler.bind(this);
    this.deletePlaylistSongsByIdHandler =
      this.deletePlaylistSongsByIdHandler.bind(this);
    this.getPlaylistActivitiesByIdHandler =
      this.getPlaylistActivitiesByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._playlistService.addPlaylist(
        name,
        credentialId
      );

      return h
        .response({
          status: "success",
          data: {
            playlistId,
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

  async getPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._playlistService.getPlaylists(credentialId);

      return {
        status: "success",
        data: playlists,
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

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistOwner(id, credentialId);
      await this._playlistService.deletePlaylist(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
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

  async postPlaylistSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);

      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._songService.getSongById(songId);
      await this._playlistService.verifyPlaylistAccess(
        playlistId,
        credentialId
      );
      await this._playlistService.addSongToPlaylist(playlistId, songId);
      await this._playlistService.addActivity(
        playlistId,
        songId,
        credentialId,
        "add"
      );

      return h
        .response({
          status: "success",
          message: "Berhasil menambah lagu ke dalam playlist",
        })
        .code(201);
    } catch (error) {
      console.log(error);
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

  async getPlaylistSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const playlist = await this._playlistService.getPlaylistSongsById(
        id,
        credentialId
      );

      return {
        status: "success",
        data: {
          playlist,
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

  async deletePlaylistSongsByIdHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);

      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(id, credentialId);
      await this._playlistService.deleteSongFromPlaylist(id, songId);
      await this._playlistService.addActivity(
        id,
        songId,
        credentialId,
        "delete"
      );

      return {
        status: "success",
        message: "Berhasil menghapus lagu dari playlist",
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

  async getPlaylistActivitiesByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(id, credentialId);

      const activities = await this._playlistService.getPlaylistActivitiesById(
        id
      );

      return {
        status: "success",
        data: {
          playlistId: id,
          activities,
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
}

module.exports = PlaylistHandler;
