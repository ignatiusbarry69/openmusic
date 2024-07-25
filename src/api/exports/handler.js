const ClientError = require("../../exceptions/ClientError.js");

class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    try {
      this._validator.validateExportPlaylistPayload(request.payload);
      const { id: userId } = request.auth.credentials;

      const { playlistId } = request.params;
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      await this._exportsService.sendMessage(
        "export:playlist",
        JSON.stringify(message)
      );

      return h
        .response({
          status: "success",
          message: "Permintaan Anda dalam antrean",
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
        .code(600);
    }
  }
}

module.exports = ExportsHandler;
