const InvariantError = require("../../exceptions/InvariantError.js");
const CollaborationsPayloadScheme = require("./schema.js");

const CollaborationsValidator = {
  validateCollaborationPayload: function (payload) {
    const validationResult = CollaborationsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
