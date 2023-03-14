const Candidate = require("../models/candidate.model");
const jwt_decode = require("jwt-decode");
const mongoose = require("mongoose");

// @Desc Obtener todos los candidatos
// @Route GET /candidate/all-candidates
// @Acceso Privado
const getAllCandidates = async (req, res) => {
  // Buscar todos los candidatos en la base de datos
  const candidates = await Candidate.find({});

  // Retornar un estatus 200 y los datos de los candidatos
  res.status(200).json({ status: "Succeeded", data: candidates, error: null });
};

// @Desc Obtener un candidato por su loginId
// @Route GET /candidate/:loginId
// @Acceso Privado
const getCandidateByLoginId = async (req, res) => {
  // Obtener el loginId del parámetro de la URL
  const loginId = req.params.loginId;

  // Buscar el candidato en la base de datos usando el loginId
  const candidate = await Candidate.findOne({ loginId: loginId });

  // Si el candidato no se encuentra, se retorna un estatus 404 y un mensaje de error
  if (!candidate) {
    return res.status(404).json({
      status: "Failed",
      data: null,
      error: "No se encontró el candidato con el loginId especificado",
    });
  }

  // Retornar un estatus 200 y la información del candidato
  res.status(200).json({ status: "Succeeded", data: candidate, error: null });
};

// @Desc Agregar un candidato a la lista de seguimiento del empleador
// @Route POST /candidate/:loginId/watchlist
// @Acceso Privado
const addToWatchlist = async (req, res) => {
  try {
    // Verificar el token del usuario
    const authHeader = req.header("auth.token") || req.header("Auth-token");
    const token = authHeader;

    const decodedToken = jwt_decode(token);

    // Verificar si el usuario loggeado es un empleador
    if (decodedToken.UserInfo.role !== "employer") {
      return res.status(401).json({
        status: "Failed",
        message: "No tienes permiso para realizar esta acción",
        data: null,
      });
    }

    // Obtener el loginId del candidato a partir de la URL
    const candidateId = req.params.loginId;
    console.log(candidateId);

    // Convertir el loginId a ObjectId
    const objectId = mongoose.Types.ObjectId(candidateId);

    // Buscar la información del candidato
    const candidate = await Candidate.findOne({ loginId: candidateId });
    if (!candidate) {
      return res.status(400).json({
        status: "Failed",
        message: "No se encontró la información del candidato",
        data: null,
      });
    }

    // Verificar si el employerId ya existe en la lista de seguimiento del candidato
    const employerExists = await Candidate.findOne({
      loginId: candidateId,
      "watchlist.employerId": decodedToken.UserInfo.id,
    });

    if (employerExists) {
      // Actualizar la fecha de lastUpdate
      await Candidate.updateOne(
        {
          loginId: candidateId,
          "watchlist.employerId": decodedToken.UserInfo.id,
        },
        { $set: { "watchlist.$.lastUpdate": Date.now() } }
      );
    } else {
      // Agregar el employerId a la lista de seguimiento del candidato
      await Candidate.findOneAndUpdate(
        { loginId: candidateId },
        {
          $push: {
            watchlist: {
              employerId: decodedToken.UserInfo.id,
              lastUpdate: Date.now(),
            },
          },
        }
      );
    }

    return res.status(200).json({
      status: "Succeeded",
      message: "Candidato agregado a la lista de seguimiento",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Error al agregar el candidato a la lista de seguimiento",
      error,
    });
  }
};

module.exports = {
  getAllCandidates,
  getCandidateByLoginId,
  addToWatchlist,
};
