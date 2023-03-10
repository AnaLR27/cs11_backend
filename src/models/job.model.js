const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  companyName: {
    type: String,
  },
  location: {
    country: {
      type: String,
      required: true,
      enum: ["España", "EEUU", "Alemania", "Reino Unido", "Francia", "Italia"],
      default: "España",
    },
    city: {
      type: String,
      required: true,
      enum: [
        "Álava",
        "Albacete",
        "Alicante",
        "Almería",
        "Asturias",
        "Ávila",
        "Badajoz",
        "Barcelona",
        "Burgos",
        "Cáceres",
        "Cádiz",
        "Cantabria",
        "Castellón",
        "Ciudad Real",
        "Córdoba",
        "Cuenca",
        "Gerona",
        "Granada",
        "Guadalajara",
        "Guipúzcoa",
        "Huelva",
        "Huesca",
        "Islas Baleares",
        "Jaén",
        "La Coruña",
        "La Rioja",
        "Las Palmas",
        "León",
        "Lérida",
        "Lugo",
        "Madrid",
        "Málaga",
        "Murcia",
        "Navarra",
        "Orense",
        "Palencia",
        "Pontevedra",
        "Salamanca",
        "Santa Cruz de Tenerife",
        "Segovia",
        "Sevilla",
        "Soria",
        "Tarragona",
        "Teruel",
        "Toledo",
        "Valencia",
        "Valladolid",
        "Vizcaya",
        "Zamora",
        "Zaragoza",
      ],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  salary: {
    type: Number,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Presencial", "Remoto", "Híbrido"],
  },
  jobActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: true,
  },

  applicants: [
    {
      applicantId: {
        type: Schema.Types.ObjectId,
        ref: "Login",
      },
      applicationDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  logo: {
    type: Schema.Types.String,
    ref: "Employer",
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
