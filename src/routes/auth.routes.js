const express = require("express");
const router = express.Router();
const {
  createNewUser,
  login,
  updateUser,
  refresh,
  changePassword,
} = require("../controllers/auth.controller");

const loginLimiter = require("../middlewares/loginLimiter");
const verifyToken = require("../middlewares/verifyToken");

router.route("/signup").post(createNewUser);

router.route("/login").post(loginLimiter, login);

router.route("/refresh").get(refresh);

router.route("/login/:id").patch(verifyToken, updateUser);

router.route("/changePassword/:id").patch(verifyToken, changePassword);

module.exports = router;
