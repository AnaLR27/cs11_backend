const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employerSchema = new Schema({
  role: {
    type: Schema.Types.String,
    ref: "Login",
  },
  loginId: {
    type: Schema.Types.ObjectId,
    ref: "Login",
  },
  userName: {
    type: Schema.Types.String,
    ref: "Login",
  },
  email: {
    type: Schema.Types.String,
    ref: "Login",
  },
  companyName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  isLookingForEmployees: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  jobs: [{ type: Schema.Types.String, ref: "Job" }],
});

const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
