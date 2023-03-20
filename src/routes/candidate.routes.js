const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const {
    getAllCandidates,
    addToWatchlist,
    fileUpload,
    getById,
    createOne,
    updateById,
    deleteById,
    uploadPhoto,
    downloadPhoto,
    modifyCandidate,
    downloadResume,
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

router.route('/candidate/all-candidates').get(verifyToken, getAllCandidates);

router.route('/candidate/:loginId/watchlist').post(verifyToken, addToWatchlist);

// Recibir documento por POST
router.post('/candidate/files/:loginId', fileUpload, (req, res) => {
    // Modificamos en BBDD
    modifyCandidate(req.params.loginId, req.file.filename);
    res.send('Archivo guardado!!');
});

// Candidate routes
router.get('/candidate/:id', verifyToken, getById);
router.post('/candidate', verifyToken, createOne);
router.patch('/candidate/:id', verifyToken, updateById);
router.delete('/candidate/:id', verifyToken, deleteById);

// Candidate image routes
router.post(
    '/candidate/:candidateId/photo',
    verifyToken,
    [uploads.single('file0')],
    uploadPhoto,
);
router.get('/candidate/photo/:file', downloadPhoto);

router.get('/candidate/file/:file', downloadResume);

module.exports = router;
