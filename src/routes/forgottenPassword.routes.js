const express = require("express");
const router = express.Router();
const { sendMail,resetPassword } = require("../controllers/forgottenPassword.controller");

router.post("/send-mail", sendMail);
router.patch("/reset-password/:token", resetPassword);

module.exports = router;