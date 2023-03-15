const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
//Importamos el modelo con el Schema correspondiente
const ModelData = require("../models/candidate.model");

const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, "../files"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Comprobar extensión y tamaño en el middleware
const fileUpload = multer({
  storage: diskstorage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    console.log(file.originalname);
    const splitName = file.originalname.split(".");
    const extension = splitName[splitName.length - 1];
    if (
      (file && extension === "pdf") ||
      extension === "doc" ||
      extension === "docx"
    ) {
      cb(null, true);
    } else {
      cb(new Error("No es un archivo pdf"));
    }
  },
}).single("file");

// Recibir documento por POST
router.post("/files/:loginId", fileUpload, (req, res) => {
  // Modificamos en BBDD
  modifyCandidate(req.params.loginId, req.file.path);

  res.send("Archivo guardado!!");   
});

const modifyCandidate = async (loginId, pathFile) => {
  try {
    // Buscamos candidato al que hacerle la modificacion
    const data = await ModelData.findOne({ loginId: loginId }).exec();
    // Comprobar si la consulta ha devuelto datos
    if (!data) {
      console.log("Usuario no encontrado");
    }
    // Modificar campo resume del candidato
    data.resume = pathFile;
    // Guardamos el cambio en el candidato en la base de datos
    await data.save();
    console.log(data);
  } catch (error) {
    console.error("Ha ocurrido un error con la base de datos: " + error);
  }
};

module.exports = router;