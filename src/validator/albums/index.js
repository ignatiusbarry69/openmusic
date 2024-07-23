const InvariantError = require("../../exceptions/InvariantError.js");
const {
  AlbumPayloadScheme,
  AlbumImageCoverHeadersScheme,
} = require("./schema.js");

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAlbumCoverHeaders: (headers) => {
    console.log("header: ", headers);
    const validationResult = AlbumImageCoverHeadersScheme.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
