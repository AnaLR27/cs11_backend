const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getCandidateByLoginId,
  getAllCandidates,
  addToWatchlist,
  fileUpload,
  modifyCandidate
} = require("../controllers/candidate.controller");

router.route("/all-candidates").get(verifyToken, getAllCandidates);

router.route("/:loginId").get(verifyToken, getCandidateByLoginId);

router.route("/:loginId/watchlist").post(verifyToken, addToWatchlist);

// Recibir documento por POST
router.post("/files/:loginId", fileUpload, (req, res) => {
  // Modificamos en BBDD
  modifyCandidate(req.params.loginId, req.file.path);
  res.send("Archivo guardado!!");   
});


module.exports = router;
