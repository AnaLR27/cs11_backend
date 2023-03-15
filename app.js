const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const mongoString = 'mongodb+srv://lauraC:987@codeproject.g2wzn5i.mongodb.net/codeproject'
// Conectar con la BBDD
mongoose.connect(mongoString, { useNewUrlParser: true });
// Guardar la conexion
const db = mongoose.connection;

// Verificar si la conexion ha sido exitosa. Ocurre en cada recarga
db.on("error", (error) => {
  console.log(error);
});
// Se ejecuta una vez,cuando se conecta a la BBDD
db.once("connected", () => {
  console.log("Succesfully connected");
});
// Recibir una notificacion cuando al conexion se ha cerrado.
db.on("disconnected", () => {
  console.log("mongoose default, connection is discconected");
});

// Importacion de controlador
const candidates = require("./src/controllers/candidate.controller");
//Crear la app
const app = express();
//Analizar los archivos json
app.use(express.json());

app.use("/candidates", candidates);

app.use(cors());

app.listen(8000, () => {
  console.log("server running", "http://localhost:" + 8000);
});