const ClientError = require("../../exceptions/ClientError.js");

class CollaborationHandler {
  constructor(collaborationService, playlistService, userService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await this._userService.getUserById(userId);

      const collaborationId = await this._collaborationService.addCollaboration(
        playlistId,
        userId
      );

      return h
        .response({
          status: "success",
          data: {
            collaborationId,
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

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationService.deleteCollaboration(playlistId, userId);

      return {
        status: "success",
        message: "Berhasil menghapus kolaborasi",
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

module.exports = CollaborationHandler;
