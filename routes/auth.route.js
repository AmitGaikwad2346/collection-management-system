const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/auth.controller");

const {
  validateSignup,
  validateLogin,
} = require("../validators/auth.validator");

const { checkValidationErrors } = require("../middlewares/validate.middleware");

router.post("/signup", validateSignup, checkValidationErrors, signup);
router.post("/login", validateLogin, checkValidationErrors, login);

module.exports = router;
