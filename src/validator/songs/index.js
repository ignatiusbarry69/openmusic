const InvariantError = require("../../exceptions/InvariantError.js");
const SongPayloadScheme = require("./schema.js");

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator;
