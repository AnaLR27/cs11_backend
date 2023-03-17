/**
 * @fileoverview routes for the login, signup refresh token ang changing password
 */

const express = require('express');
const router = express.Router();
const {
	createNewUser,
	login,
	refresh,
	changePassword,
} = require('../controllers/auth.controller');

const loginLimiter = require('../middlewares/loginLimiter');

const verifyToken = require('../middlewares/verifyToken');

router.route('/auth/signup').post(createNewUser);

router.route('/auth/login').post(loginLimiter, login);

router.route('/auth/refresh').get(refresh);

router.route('/auth/changePassword/:id').patch(verifyToken, changePassword);

module.exports = router;
