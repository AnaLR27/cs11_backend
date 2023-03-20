/**
 * @file auth.controller.js
 * @description This file contains the controller for the routes in auth.routes.js
 */

const Login = require('../models/auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const EmployerModel = require('../models/employer.model');
const Candidate = require('../models/candidate.model');

/**
 * @desc Create new user
 * @route POST /signup
 * @access Private
 * @author Alina Dorosh
 * @modifyBy VeroniKa
 */

const createNewUser = asyncHandler(async (req, res) => {
    const { email, password, role, userName } = req.body;

    // Confirm data
    if (!userName || !password || !role || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newUser = new Login({
            email,
            password: await bcrypt.hash(password, 10),
            role,
            userName,
            registerAt: new Date(),
            lastLogin: new Date(),
        });
        newUser
            .save()
            .then(async (newUser) => {
                if (role === 'employer') {
                    const modelData = new EmployerModel({
                        loginId: newUser._id,
                    });
                    const data = await modelData.save();
                } else {
                    const modelData = new Candidate({
                        loginId: newUser._id,
                    });
                    const data = await modelData.save();
                }
                res.status(201).json({
                    status: 'success',
                    message: 'User created successfully',
                    newUser: {
                        id: newUser._id,
                        email: newUser.email,
                        role: newUser.role,
                        accessToken: jwt.sign(
                            {
                                UserInfo: {
                                    id: newUser._id,
                                    email: newUser.email,
                                    role: newUser.role,
                                },
                            },
                            process.env.ACCESS_TOKEN_SECRET,
                            {
                                expiresIn:
                                    process.env.NODE_ENV === 'development'
                                        ? '1d'
                                        : '15m',
                            },
                        ),
                        refreshToken: jwt.sign(
                            { email: newUser.email },
                            process.env.REFRESH_TOKEN_SECRET,
                            { expiresIn: '7d' },
                        ),
                    },
                    error: null,
                });
            })
            .catch((error) => {
                if (error.code === 11000) {
                    return res.status(409).json({
                        status: 'failed',
                        message: 'This email is already registered',
                        data: null,
                        error: error.message,
                    });
                }
                return res.status(400).json({
                    message: 'failed',
                    data: null,
                    error: error.message,
                });
            });
    } catch (error) {
        if (error.message === 'data and salt arguments required') {
            res.status(422).json({
                status: 'failed',
                data: null,
                message:
                    'Password is required, please insert a valid password and try again',
                error: error.message,
            });
        }
    }
});

/**
 * @desc Login
 * @route POST /auth/login
 * @access Public
 * @author Alina Dorosh
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'All fields are required',
            data: null,
            error: error.message,
        });
    }
    try {
        const foundUser = await Login.findOne({ email }).exec();

        if (!foundUser || !foundUser.active) {
            return res.status(401).json({
                message: 'Unauthorized',
                data: null,
                error: 'Wrong email or password',
            });
        } else if (foundUser) {
            const match = await bcrypt.compare(password, foundUser.password);
            if (!match)
                return res.status(401).json({
                    message: 'Unauthorized',
                    data: null,
                    error: 'Wrong email or password',
                });
            if (match) {
                // Update last login
                await Login.findOneAndUpdate(
                    {
                        email: foundUser.email, // find by email
                    },
                    { lastLogin: new Date() },
                );
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            id: foundUser._id,
                            email: foundUser.email,
                            role: foundUser.role,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn:
                            process.env.NODE_ENV === 'development'
                                ? '1d'
                                : '15m',
                    },
                );

                const refreshToken = jwt.sign(
                    { email: foundUser.email },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '7d' },
                );

                // Send accessToken and refreshToken
                res.json({
                    accessToken,
                    refreshToken,
                    id: foundUser._id,
                    role: foundUser.role,
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            message: 'failed',
            data: null,
            error: error.message,
        });
    }
};

/**
 * @desc Refresh
 * @route GET /auth/refresh
 * @access Public - because access token has expired
 * @author Alina Dorosh
 */
const refresh = (req, res) => {
    const refreshToken = req.headers['auth-token'];
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,

        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const foundUser = await Login.findOne({
                email: decoded.email,
            }).exec();

            if (!foundUser)
                return res.status(401).json({ message: 'Unauthorized' });

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        id: foundUser._id,
                        email: foundUser.email,
                        role: foundUser.role,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' },
            );

            res.json({ accessToken, id: foundUser._id, role: foundUser.role });
        }),
    );
};

// @Desc Cambiar la contraseña
// @Route PATCH /auth/changePassword/:id
// @Acceso Privado
// @Autor Nelson Gonzalez
const changePassword = asyncHandler(async (req, res) => {
    // Recuperar la antigua contraseña y la nueva contraseña del cuerpo de la solicitud
    const { oldPassword, newPassword } = req.body;

    // Buscar al usuario en la base de datos utilizando el id proporcionado en la URL
    const foundUser = await Login.findById(req.params.id).exec();

    // Si no se encuentra al usuario, retornar un estatus 401 y un mensaje "No autorizado"
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

    // Comparar la antigua contraseña proporcionada con la contraseña almacenada en la base de datos
    const match = await bcrypt.compare(oldPassword, foundUser.password);

    // Si las contraseñas no coinciden, retornar un estatus 401 y un mensaje de error
    if (!match)
        return res.status(401).json({
            message: 'Unauthorized',
            data: null,
            error: 'Old Password is incorrect',
        });

    // Si las contraseñas coinciden, proceder a actualizar la contraseña
    if (match) {
        // Hashear la nueva contraseña
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        // Actualizar el usuario en la base de datos con la nueva contraseña
        const updatedUser = await Login.findByIdAndUpdate(
            req.params.id,
            {
                password: newPasswordHash,
            },
            {
                new: true,
            },
        );

        // Retornar un estatus 200 y el usuario actualizado
        res.status(200).json({ status: 'Succedeed', updatedUser, error: null });
    }
});

module.exports = {
    createNewUser,
    login,
    refresh,
    changePassword,
};
