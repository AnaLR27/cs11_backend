/**
 * @fileoverview routes for the login, signup and refresh token
 * @author Alina Dorosh
 */

const express = require("express");
const router = express.Router();
const {
  createNewUser,
  login,
  refresh,
} = require("../controllers/auth.controller");

const loginLimiter = require("../middleware/loginLimiter");

router.route("/signup").post(createNewUser);

router.route("/login").post(loginLimiter, login);

router.route("/refresh").get(refresh);

module.exports = router;
