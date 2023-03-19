/**
 * @author VeróniKa Sánchez
 * @modified Alina Dorosh
 */

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const {
    getById,
    createOne,
    updateById,
    uploadLogo,
    downloadLogo,
    deleteById,
} = require('../controllers/employer.controller');

/* Image upload */

//upload settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/logos/');
    },
    filename: (req, file, cb) => {
        cb(null, 'logo-' + Date.now() + '-' + file.originalname);
    },
});

const uploads = multer({ storage });

//Routes
router.get('/employer/:id', verifyToken, getById);
router.post('/employer', verifyToken, createOne);
router.patch('/employer/:id', verifyToken, updateById);
router.delete('/employer/:id', verifyToken, deleteById);
router.get('/employer/logo/:file', downloadLogo);
router.post(
    '/employer/:employerId/logo',
    [uploads.single('file0')],
    verifyToken,
    uploadLogo,
);

module.exports = router;
