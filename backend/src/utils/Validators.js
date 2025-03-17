const { body } = require("express-validator");

exports.validateTeamMember = [
  body("email").isEmail().withMessage("Invalid email format"),

  body("sharedOn")
    .optional()
    .isISO8601()
    .withMessage("shared_on must be a valid date"),

  body("permissionType")
    .isIn(["read", "write"])
    .withMessage("Permission type must be 'read' or 'write'"),

  body("folders")
    .optional()
    .isArray()
    .withMessage("Folders must be an array"),

  body("folders.*")
    .optional()
    .isString()
    .withMessage("Each folder name must be a string"),
];
