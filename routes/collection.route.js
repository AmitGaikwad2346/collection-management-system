const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth.middleware");
const {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/collection.controller");

const {
  validateCreateAndUpdateCollection,
  validatePagination,
} = require("../validators/collection.validator");

const { checkValidationErrors } = require("../middlewares/validate.middleware");

router
  .route("/")
  // Get all collections
  .get(
    authenticateUser,
    validatePagination,
    checkValidationErrors,
    getCollections
  )
  // Create a new collection
  .post(
    authenticateUser,
    validateCreateAndUpdateCollection,
    checkValidationErrors,
    createCollection
  );

router
  .route("/:id")
  // Get a collection by ID
  .get(authenticateUser, getCollectionById)
  // Update a collection by ID
  .put(
    authenticateUser,
    validateCreateAndUpdateCollection,
    checkValidationErrors,
    updateCollection
  )
  // Delete a collection by ID
  .delete(authenticateUser, deleteCollection);

module.exports = router;
