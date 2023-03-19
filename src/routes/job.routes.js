const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getAllJobs,
  getJobsAppliedByLoginId,
  removeJobApplication,
  updateJobByLoginIdAndJobId,
  getJobList,
  createJob,
  getJobByJobId,
  getEmployerJobsByLoginId,
  removeJobByLoginIdAndJobId,
  email,
  getCandidateAppliedJobs,
  deleteCandidateAppliedJobs,
  applyToJob,
} = require("../controllers/job.controller");

router.route("/job/all-jobs").get(verifyToken, getAllJobs);

router.get("/job/jobs-applied/:loginId", verifyToken, getJobsAppliedByLoginId);

router.delete(
  "/job/jobs-applied/:loginId/:jobId",
  verifyToken,
  removeJobApplication
);

router.patch(
  "/job/edit-job/:jobId",
  verifyToken,
  updateJobByLoginIdAndJobId
);

router.get("/job/job-list", verifyToken, getJobList);

router.post("/job/post-job", verifyToken, createJob);

router.get("/job/job-single/:jobId", verifyToken, getJobByJobId);

router.get(
  "/job/employer-jobs/:loginId",
  verifyToken,
  getEmployerJobsByLoginId
);

router.delete(
  "/job/delete-job/:loginId/:jobId",
  verifyToken,
  removeJobByLoginIdAndJobId
);

router.post("/job/email", verifyToken, email);

router.get(
  "/job/candidate-applied-jobs/:loginId",
  verifyToken,
  getCandidateAppliedJobs
);

router.delete(
  "/job/candidate-applied-jobs/:loginId/:jobId",
  verifyToken,
  deleteCandidateAppliedJobs
);

router.post("/job/job-single/:loginId/:jobId", verifyToken, applyToJob);

module.exports = router;
