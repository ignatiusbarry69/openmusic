const InvariantError = require("../../exceptions/InvariantError.js");
const {
  PlaylistsPayloadScheme,
  SongsPlaylistPayloadScheme,
} = require("./schema.js");

const PlaylistsValidator = {
  validatePlaylistPayload: function (payload) {
    const validationResult = PlaylistsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongPlaylistPayload: function (payload) {
    const validationResult = SongsPlaylistPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
