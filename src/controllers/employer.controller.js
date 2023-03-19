/**
 * @author VeróniKa <vsc1972@gmail.com>
 * @modified
 */
const EmployerModel = require('../models/employer.model');
const Auth = require('../models/auth.model');
const fs = require('fs');
const path = require('path');
const { Request, Response } = require('express');

/**
 * Function to get an employer record by id or loginId.
 * @param {Request} req request data
 * @param {Response} res response data
 * @returns the response json object with the corresponding data.
 * @access private
 * @route [GET] - /employer/:id
 */
const getById = async (req, res) => {
    try {
        const data = await EmployerModel.findOne({
            $or: [{ _id: req.params.id }, { loginId: req.params.id }],
        })
            .populate('loginId')
            .exec();

        if (!data) {
            return res.status(404).json({
                status: 'failed',
                data: null,
                error: 'Usuario no encontrado',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Success',
            data: data,
            error: null,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: 'failed', data: null, error: error.message });
    }
};
/**
 * Function to create an employer record.
 * @param {Request} req request data
 * @param {Response} res response data
 * @returns the response json object with the corresponding data.
 * @access private
 * @route [POST] - /employer
 */
const createOne = async (req, res) => {
    try {
        const modelData = new EmployerModel(req.body);
        const data = await modelData.save();
        if (!data) {
            return res.status(404).json({
                status: 'failed',
                data: null,
                error: 'Usuario no creado',
            });
        }
        const createdEmployer = await EmployerModel.findById(data._id)
            .populate('loginId')
            .exec();
        res.status(200).json({
            success: true,
            message: 'Success',
            data: createdEmployer,
            error: null,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: 'failed', data: null, error: error.message });
    }
};

/**
 * Function to update an employer record by id or loginId.
 * @param {Request} req request data
 * @param {Response} res response data
 * @returns the response json object with the corresponding data.
 * @access private
 * @route [PATCH] - /employer/:id
 */
const updateById = async (req, res) => {
    try {
        const data = await EmployerModel.findOneAndUpdate(
            {
                $or: [{ _id: req.params.id }, { loginId: req.params.id }],
            },
            req.body,
            { new: true },
        )
            .populate('loginId')
            .exec();
        if (!data) {
            return res.status(404).json({
                status: 'failed',
                data: null,
                error: 'Usuario no encontrado',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Success',
            data: data,
            error: null,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: 'failed', data: null, error: error.message });
    }
};

/**
 * Function to delete an user by id.
 * @param { import('express').Request } req request data
 * @param { import('express').Response } res response data
 * @returns Json object with status, data and error.message.
 * @access private
 * @route [POST] - /employer/:employerId/
 */
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const employer = await EmployerModel.findOne({
            $or: [{ _id: id }, { loginId: id }],
        }).exec();
        // Detele user data
        const deleteUserEntry = await EmployerModel.findOneAndDelete(
            employer._id,
        );
        if (deleteUserEntry) {
            // Delete login data
            await Auth.findByIdAndDelete(employer.loginId);
            // Delete user image
            try {
                if (employer.logo) {
                    const logoPath = './src/uploads/logos/' + employer.logo;
                    fs.unlinkSync(logoPath);
                }
            } catch (err) {}

            res.status(200).json({
                status: 'success',
                data: undefined,
                error: null,
            });
        } else {
            res.status(404).json({
                status: 'not_found',
                data: undefined,
                error: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            data: undefined,
            error: error.message,
        });
    }
};

/**
 * Function to upload an image file to a employer record by id or loginId.
 * @param {Request} req request data
 * @param {Response} res response data
 * @returns the response json object with the corresponding file.
 * @access private
 * @route [POST] - /employer/:employerId/logo
 */
const uploadLogo = async (req, res) => {
    try {
        //Get the image file and check that it exists
        const data = await EmployerModel.findOne({
            $or: [
                { _id: req.params.employerId },
                { loginId: req.params.employerId },
            ],
        }).exec();
        if (!data) {
            return res.status(404).json({
                status: 'failed',
                data: null,
                error: 'Usuario no encontrado',
            });
        }
        /*
            If there is already an associated logo, we delete it.
            (We put it in a tryCatch in case something fails during the deletion process, it doesn't break the process)
            */
        if (data.logo) {
            try {
                const filePath = './src/uploads/logos/' + data.logo;
                fs.unlinkSync(filePath);
            } catch (error) {}
        }
        //Get the file name
        let image = req.file.originalname;
        //Get file extension
        const imageSplit = image.split('.');
        const extension = imageSplit[imageSplit.length - 1];
        //Check the file extension and delete it if it is invalid
        if (extension != 'png' && extension != 'jpg' && extension != 'jpeg') {
            const filePath = req.file.path;
            //Delete the file
            fs.unlinkSync(filePath);
            return res.status(404).json({
                status: 'error',
                message: 'Extensión no válida',
            });
        }
        //If correct, save to ddbb.
        data.logo = req.file.filename;
        data.markModified('logo');
        const saveResponse = await data.save();
        const updatedEmployer = await EmployerModel.findById(saveResponse._id)
            .populate('loginId')
            .exec();
        return res.status(200).json({
            success: true,
            message: 'Success',
            data: updatedEmployer,
            error: null,
            file: req.file.path,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: 'failed', data: null, error: error.message });
    }
};
/**
 * Function to download an image file by image name .
 * @param {Request} req request data
 * @param {Response} res response data
 * @returns image file.
 * @access public
 * @route [GET] - /employer/logo/:file'
 */
const downloadLogo = async (req, res) => {
    try {
        //Get parameter from url
        const file = req.params.file;
        //Mount the real path of the image
        const filePath = './src/uploads/logos/' + file;

        //Check that the file exists
        fs.stat(filePath, (error, exists) => {
            if (!exists) {
                return res.status(404).json({
                    status: 'failed',
                    data: null,
                    error: error.message,
                });
            }
            return res.sendFile(path.resolve(filePath));
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: 'failed', data: null, error: error.message });
    }
};

module.exports = {
    getById,
    createOne,
    updateById,
    deleteById,
    uploadLogo,
    downloadLogo,
};
