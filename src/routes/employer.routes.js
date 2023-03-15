/**
 * @author VeróniKa Sánchez
 * @modified Alina Dorosh
 */
const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');

// seria bueno tener el middleware para checkear el rol en el back tambien
//const  checkRole = require("../middlewares/checkRole");//

const {
    getById,
    createOne,
    updateById,
    uploadLogo,
    downloadLogo,
} = require('../controllers/employer.controller');
// Image upload
const multer = require('multer');
//upload settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/files/logos/');
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
router.get('/employer/logo/:file', downloadLogo);
router.post(
    '/employer/:employerId/logo',
    verifyToken,
    [uploads.single('file0')],
    uploadLogo,
);

module.exports = router;
