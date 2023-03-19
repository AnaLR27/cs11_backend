/**
 * @fileoverview Routes for reseting password
 * @author Alina Dorosh
 */

const express = require("express");
const router = express.Router();
const { sendMail,resetPassword } = require("../controllers/forgottenPassword.controller");

router.post("/forgotten-password/send-mail", sendMail);
router.patch("/forgotten-password/reset-password/:token", resetPassword);

module.exports = router;