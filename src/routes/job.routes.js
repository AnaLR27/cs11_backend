const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
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
} = require('../controllers/job.controller');

router.route('/all-jobs').get(verifyToken, getAllJobs);

router.get('/jobs-applied/:loginId', verifyToken, getJobsAppliedByLoginId);

router.delete(
	'/jobs-applied/:loginId/:jobId',
	verifyToken,
	removeJobApplication,
);

router.patch(
	'/edit-job/:loginId/:jobId',
	verifyToken,
	updateJobByLoginIdAndJobId,
);

router.get('/job-list', verifyToken, getJobList);

router.post('/post-job', verifyToken, createJob);

router.get('/job-single/:jobId', verifyToken, getJobByJobId);

router.get('/employer-jobs/:loginId', verifyToken, getEmployerJobsByLoginId);

router.delete(
	'/delete-job/:loginId/:jobId',
	verifyToken,
	removeJobByLoginIdAndJobId,
);

router.post('/email', verifyToken, email);

router.get(
	'/candidate-applied-jobs/:loginId',
	verifyToken,
	getCandidateAppliedJobs,
);

router.delete(
	'/candidate-applied-jobs/:loginId/:jobId',
	verifyToken,
	deleteCandidateAppliedJobs,
);

module.exports = router;
