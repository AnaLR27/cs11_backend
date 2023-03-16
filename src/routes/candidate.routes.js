const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const {
	getCandidateByLoginId,
	getAllCandidates,
	addToWatchlist,
	fileUpload,
	modifyCandidate,
	getById,
	createOne,
	updateById,
	uploadPhoto,
	downloadPhoto,
} = require('../controllers/candidate.controller');

const storage = multer.diskStorage({
	destination: (_req, file, cb) => {
		cb(null, './src/uploads/photos/');
	},
	filename: (_req, file, cb) => {
		cb(null, 'photo-' + Date.now() + '-' + file.originalname);
	},
});

const uploads = multer({ storage });

router.route('/all-candidates').get(verifyToken, getAllCandidates);

router.route('/:loginId').get(verifyToken, getCandidateByLoginId);

router.route('/:loginId/watchlist').post(verifyToken, addToWatchlist);

// Recibir documento por POST
router.post('/files/:loginId', fileUpload, (req, res) => {
	// Modificamos en BBDD
	modifyCandidate(req.params.loginId, req.file.path);
	res.send('Archivo guardado!!');
});

// Candidate routes
router.get('/:id', verifyToken, getById);
router.post('/', verifyToken, createOne);
router.patch('/:id', verifyToken, updateById);
// Candidate image routes
router.post(
	'/:candidateId/photo',
	verifyToken,
	[uploads.single('file0')],
	uploadPhoto,
);
router.get('/photo/:file', downloadPhoto);

module.exports = router;
