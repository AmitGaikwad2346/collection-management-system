const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth.middleware");
const {
  createRecommendation,
  addRecommendationToCollection,
  removeRecommendationFromCollection,
  getRecommendations,
} = require("../controllers/recommendation.controller");

const {
  validateCreateRecommendation,
  validateAddRemoveRecommendation,
  validatePagination,
} = require("../validators/recommendation.validator");

const { checkValidationErrors } = require("../middlewares/validate.middleware");

router
  .route("/")
  // Create new recommendation
  .post(
    authenticateUser,
    validateCreateRecommendation,
    checkValidationErrors,
    createRecommendation
  )
  // Get all recommendations
  .get(
    authenticateUser,
    validatePagination,
    checkValidationErrors,
    getRecommendations
  );

router
  .route("/:collectionId")
  // Add recommendation
  .post(
    authenticateUser,
    validateAddRemoveRecommendation,
    checkValidationErrors,
    addRecommendationToCollection
  )
  // Remove recommendation
  .delete(
    authenticateUser,
    validateAddRemoveRecommendation,
    checkValidationErrors,
    removeRecommendationFromCollection
  );

module.exports = router;
