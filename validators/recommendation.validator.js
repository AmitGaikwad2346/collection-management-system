const { body, query } = require("express-validator");

const validateCreateRecommendation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

const validateAddRemoveRecommendation = [
  body("recommendationId")
    .notEmpty()
    .withMessage("Recommendation ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid Recommendation ID format"),
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

module.exports = {
  validateCreateRecommendation,
  validateAddRemoveRecommendation,
  validatePagination,
};
