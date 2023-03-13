const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  role: {
    type: Schema.Types.String,
    ref: "Login",
    required: true,
  },
  loginId: {
    type: Schema.Types.ObjectId,
    ref: "Login",
    required: true,
  },
  userName: {
    type: Schema.Types.String,
    required: true,
    ref: "Login",
  },
  email: {
    type: Schema.Types.String,
    required: true,
    ref: "Login",
  },
  fullName: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
    enum: [
      "Desarrollador Web",
      "Desarrollador Móvil",
      "Data Science",
      "UX/UI",
      "DevOps",
      "Ciberseguridad",
      "Marketing",
      "Ventas",
      "Otros",
    ],
    default: "Desarrollador Web",
  },
  bootcamp: {
    type: String,
    required: true,
  },
  edition: {
    type: Number,
    required: true,
  },

  languages: [
    {
      type: String,
      required: true,
    },
  ],
  socialNetworks: {
    linkedin: String,
    github: String,
  },
  description: {
    type: String,
    required: true,
  },
  professionalSkills: [
    {
      type: String,
      enum: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Angular",
        "Vue",
        "Node",
        "Express",
        "MongoDB",
        "MySQL",
        "Python",
        "Java",
        "C#",
        "C++",
        "C",
        "PHP",
        "Git",
        "GitHub",
        "BitBucket",
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "Jira",
        "Diseño UX/UI",
        "WordPress",
        "Android",
        "iOS",
        "Otros",
      ],
    },
  ],
  registerAt: {
    type: Schema.Types.Date,
    ref: "Login",
  },
  isLookingForJob: {
    type: Boolean,
    required: true,
  },
  appliedJobs: [
    {
      idJob: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },
      appliedDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  resume: {
    type: String,
  },
  photo: {
    type: String,
  },
  watchlist: [
    {
      employerId: {
        type: Schema.Types.ObjectId,
        ref: "Employer",
        required: true,
      },
      lastUpdate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
