const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getCandidateByLoginId,
  getAllCandidates,
  addToWatchlist,
} = require("../controllers/candidate.controller");

router.route("/all-candidates").get(verifyToken, getAllCandidates);

router.route("/:loginId").get(verifyToken, getCandidateByLoginId);

router.route("/:loginId/watchlist").post(verifyToken, addToWatchlist);

module.exports = router;
