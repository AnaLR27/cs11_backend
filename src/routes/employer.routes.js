/**
 * @author 'VeróniKa Sánchez'
 * @modified
 */
const express = require('express');
const router = express.Router();
const EmployerController = require('../controllers/employer.controller');
const controller = new EmployerController();

/* Image upload */
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
router.get('/employer/:id', controller.getById.bind(controller));
router.post('/employer', controller.createOne.bind(controller));
router.patch('/employer/:id', controller.updateById.bind(controller));
router.get('/employer/logo/:file', controller.downloadLogo.bind(controller));
router.post(
    '/employer/:employerId/logo',
    [uploads.single('file0')],
    controller.uploadLogo.bind(controller),
);

module.exports = router;
