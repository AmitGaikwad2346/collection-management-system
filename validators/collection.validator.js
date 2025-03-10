const { body, query } = require("express-validator");

const validateCreateAndUpdateCollection = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Collection name is required")
    .isLength({ min: 3 })
    .withMessage("Collection name must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("Collection name cannot exceed 100 characters"),
];

const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a positive integer between 1 and 100"),
];

module.exports = { validateCreateAndUpdateCollection, validatePagination };
