/**
 * @fileoverview Controllers for forgotten password
 * @author Alina Dorosh
 */

const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Login = require("../models/auth.model");

/**
 * @description Send email with link and token to reset password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Returns an object with message
 * @route POST /forgotten-password/send-mail
*/
const sendMail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "laughingoutloud90@gmail.com",
      pass: "xwnmvqzcrgaykdip",
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
  const transporter = nodemailer.createTransport(config);
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password",
    html: `
    <h1>Cambio de contraseña</h1>
    <p>Has solicitado cambiar tu contraseña en portal CodeSpaceWork</p>
    <p>Click <a href="http://localhost:3000/reset-password/${token}">aquí</a> para cambiar tu contraseña</p>
    <p>Si no lo has solisitado ignora este correo</p>
    `,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal server error",
      });
    } else {
      res.status(200).json({
        message: "Email sent successfully",
      });
    }
  });
});


/**
 * @description Reset password controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Returns an object with message
 * @route PATCH /forgotten-password/reset-password/:token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  if (!newPassword)
    return res.status(400).json({ message: "Password is required" });
  if (!token) return res.status(400).json({ message: "Unauthorized" });

  const decoded = jwt_decode(token);
  const foundUser = await Login.findOne({ email: decoded.email });
  if (!foundUser) return res.status(400).json({ message: "User not found" });

  if (foundUser) {
    await Login.findByIdAndUpdate(
      foundUser._id,
      { password: await bcrypt.hash(newPassword, 10) },
      { new: true }
    );

    res.status(200).json({
      message: "Password changed successfully",
    });
  } else {
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

module.exports = { sendMail, resetPassword };
