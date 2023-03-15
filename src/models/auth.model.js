/**
 * @fileoverview This file contains the register schema for the database.
 * named Login in order to save it in the database as "logins"
 * @author Alina Dorosh
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginSchema = new Schema({
  userName: {
    type: String,
    required: true,
    minlength: 4,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 60,
    maxlength: 60,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "candidate", "employer"],
    trim: true,
    default: "candidate",
  },
  registerAt: {
    type: Date,
    immutable: true,
    required: true,
  },
  lastLogin: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const login = mongoose.model("Login", loginSchema);

module.exports = login;