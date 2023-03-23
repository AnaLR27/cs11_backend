const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Job = require('../models/job.model.js');
const Employer = require('../models/employer.model.js');
const Candidate = require('../models/candidate.model.js');
const Login = require('../models/auth.model.js');
const asyncHandler = require('express-async-handler');

// @Desc Obtener todas las ofertas de trabajo
// @Route GET /job/all-jobs
// @Access Privado
const getAllJobs = async (req, res) => {
    try {
        // Buscar todas las ofertas de trabajo activas y populadas por la empresa
        const jobs = await Job.find({ jobActive: true }).populate({
            path: 'company',
            select: 'logo companyName',
            model: 'Employer',
        });
        // Enviar una respuesta exitosa con los datos de las ofertas de trabajo
        res.status(200).json({ status: 'Succeeded', data: jobs, error: null });
    } catch (error) {
        // Enviar una respuesta con error en caso de que ocurra algún problema
        res.status(404).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// @Desc Obtener trabajos por loginId
// @Route GET /job/employer-jobs/:loginId
// @Access Privado
const getEmployerJobsByLoginId = async (req, res) => {
    try {
        const loginId = req.params.loginId;
        // Buscar el employer usando el loginId
        const employer = await Employer.findOne({
            $or: [{ _id: loginId }, { loginId: loginId }],
        }).exec();
        console.log(employer);
        // Si el employer no se encuentra, retornar un estatus 404 y un mensaje de error
        if (!employer) {
            return res.status(404).json({
                status: 'Failed',
                data: null,
                error: `No se encontró el employer con el loginId ${loginId}`,
            });
        }
        // Obtener los trabajos de la empresa y retornar un estatus 200 con la lista de trabajos con el id de employer
        const jobs = await Job.find({ company: employer._id })
            .populate('company')
            .populate('applicants.applicantId');
        res.status(200).json({ status: 'Succeeded', data: jobs, error: null });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// @Desc Eliminar un trabajo de un determinado empleador por su loginId y jobId
// @Route DELETE /job/delete-job/:loginId/:jobId
// @Access Privado
const removeJobByLoginIdAndJobId = async (req, res) => {
    try {
        // Verificar el token del usuario
        const authHeader = req.header('auth-token') || req.header('Auth-token');
        const token = authHeader;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Verificar si el usuario loggeado es un empleador
        if (decodedToken.UserInfo.role !== 'employer') {
            return res.status(401).json({
                status: 'Failed',
                error: 'No tienes permiso para realizar esta acción',
                data: null,
            });
        }

        // Obtener el loginId y jobId del empleador a partir de la URL
        const loginId = req.params.loginId;
        const jobId = req.params.jobId;
        const data = await Employer.findOne({
            $or: [{ _id: loginId }, { loginId: loginId }],
        }).exec();
        console.log(jobId);
        // Verificar que el empleador loggeado es el dueño del trabajo
        const job = await Job.findOne({ company: data._id, _id: jobId })
            .populate('company')
            .exec();
        if (!job) {
            return res.status(400).json({
                status: 'Failed',
                error: 'No se encontró el trabajo especificado',
                data: null,
            });
        }
        if (decodedToken.UserInfo.id !== job.company?.loginId.toString()) {
            console.log(decodedToken.UserInfo.id);
            console.log(job.company);
            return res.status(403).json({
                status: 'Failed',
                error: 'No tienes permiso para eliminar este trabajo',
                data: null,
            });
        }

        // Eliminar el trabajo
        const deletedJob = await Job.findOneAndDelete({
            company: data._id,
            _id: jobId,
        });

        return res.status(200).json({
            status: 'Succeeded',
            error: null,
            data: deletedJob,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Failed',
            error: 'Error al eliminar el trabajo',
            data: null,
        });
    }
};

// @Desc Editar un trabajo de un determinado empleador por su loginId y jobId
// @Route PUT /job/edit-job/:loginId/:jobId
// @Access Privado
const updateJobByLoginIdAndJobId = async (req, res) => {
    try {
        // Verificar el token del usuario
        const authHeader = req.header('auth-token') || req.header('Auth-token');
        const token = authHeader;
        const decodedToken = jwt_decode(token);

        // Obtener el loginId y el jobId de los parámetros de la ruta
        const jobId = req.params.jobId;

        // Actualizar la información del trabajo
        const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
            new: true,
        });

        // Enviar una respuesta exitosa con los datos actualizados del trabajo
        res.status(200).json({
            status: 'Succeeded',
            data: updatedJob,
            error: null,
        });
    } catch (error) {
        // Enviar una respuesta con error en caso de que ocurra algún problema
        res.status(404).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// @Desc Obtener lista de ofertas de trabajo
// @Route GET /job/job-list
// @Access Privado
const getJobList = async (req, res) => {
    try {
        // Buscar ofertas de trabajo activas y seleccionar los campos específicos
        const jobs = await Job.find(
            { jobActive: true },
            {
                title: 1,
                company: 1,
                companyName: 1,
                location: 1,
                logo: 1,
                jobActive: 1,
            },
        ).populate({
            // Popular la información de la compañía relacionada
            path: 'company',
            select: 'logo companyName',
            model: 'Employer',
        }); // Retornar un estatus 200 y los datos encontrados
        res.status(200).json({ status: 'Succeeded', data: jobs, error: null });
    } catch (error) {
        // Si hay un error en la búsqueda, retornar un estatus 404 y un mensaje de error
        res.status(404).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// @Desc Crear un nuevo trabajo
// @Route POST /job/post-job
// @Acceso Privado
const createJob = async (req, res) => {
    try {
        // Verificar el token del usuario
        const authHeader = req.header('auth-token') || req.header('Auth-token');
        const token = authHeader;

        const decodedToken = jwt_decode(token);

        // Obtener los datos del usuario
        const {
            title,
            description,
            location,
            salary,
            jobType,
            workDay,
            jobActive,
        } = req.body;
        const createdAt = new Date();

        // Buscar la información de la compañía
        const company = await Employer.findOne({
            loginId: decodedToken.UserInfo.id,
        });
        if (!company) {
            return res.status(400).json({
                status: 'Failed',
                message: 'No se encontró la información de la compañía',
                data: null,
            });
        }

        // Crear una nueva oferta de trabajo
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            jobType,
            jobActive,
            createdAt,
            company: company._id,
            workDay: workDay,
        });

        await newJob.save();

        return res.status(201).json({
            status: 'Succeeded',
            message: 'Oferta de trabajo creada exitosamente',
            data: newJob,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Failed',
            message: 'Error al crear la oferta de trabajo',
            error,
        });
    }
};

// @Desc Obtener un trabajo por su id
// @Route GET /job/job-single/:jobId
// @Acceso Privado
const getJobByJobId = async (req, res) => {
    // Obtener el id del trabajo de los parámetros de la URL
    const jobId = req.params.jobId;

    // Buscar la oferta de trabajo en la base de datos usando el id
    const job = await Job.findById(jobId).populate('company').exec();

    // Si la oferta de trabajo no se encuentra, se retorna un estatus 400 y un mensaje de error
    if (!job) {
        return res.status(400).json({
            status: 'Failed',
            data: null,
            error: `No se encontró la oferta de trabajo con el id ${jobId}`,
        });
    }

    // Retornar un estatus 200 y la oferta de trabajo
    res.status(200).json({ status: 'Succeeded', data: job, error: null });
};

// @Desc Obtiene ofertas de trabajo aplicadas por el loginId
// @Route GET /job/jobs-applied/:loginId
// @Access Privado
const getJobsAppliedByLoginId = async (req, res) => {
    try {
        const loginId = req.params.loginId;
        // Find the candidate and check if it exists
        const candidate = await Candidate.findOne({
            $or: [{ _id: loginId }, { loginId: loginId }],
        }).exec();
        const jobs = Job.find({ 'applicants.applicantId': candidate._id });
        //Si no hay jobs devuelve un 404 y sale
        if (!jobs) {
            return res.status(404).json({
                status: 'Failed',
                data: null,
                error: null,
            });
        }
        console.log(candidate);
        console.log(jobs);

        res.status(200).json({
            status: 'Succeeded',
            data: jobs,
            error: null,
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// @Desc Eliminar una inscripción a una oferta de trabajo por jobId y loginId
// @Route DELETE /job/jobs-applied/:loginId/:jobId
// @Acceso Privado
const removeJobApplication = async (req, res) => {
    try {
        // Obtener el jobId y el loginId de los parámetros de la URL
        const jobId = req.params.jobId;
        const loginId = req.params.loginId;

        // Find the candidate and check if it exists
        const candidate = await Candidate.findOne({
            $or: [{ _id: loginId }, { loginId: loginId }],
        }).exec();

        // Si el candidato no se encuentra, se retorna un estatus 404 y un mensaje de error
        if (!candidate) {
            return res.status(404).json({
                status: 'Failed',
                data: null,
                error: 'No se encontró el candidato con el loginId especificado',
            });
        }
        // Buscar el trabajo por su ID
        const job = await Job.findById(jobId);

        // Si el trabajo no se encuentra, se retorna un estatus 404 y un mensaje de error
        if (!job) {
            return res.status(404).json({
                status: 'Failed',
                data: null,
                error: 'No se encontró la oferta de trabajo con el jobId especificado',
            });
        }

        // Buscar si el loginId del candidato está en la lista de applicants
        const applicantIndex = job.applicants.findIndex(
            (applicant) => applicant.applicantId === candidate._id,
        );

        // Si el candidato no se encuentra inscrito en el trabajo, se retorna un estatus 400 y un mensaje de error
        if (applicantIndex === -1) {
            return res.status(400).json({
                status: 'Failed',
                data: null,
                error: 'El usuario no se encuentra inscrito en la oferta de trabajo especificada',
            });
        }

        // Eliminar el objeto del candidato de la lista de applicants
        job.applicants.splice(applicantIndex, 1);

        //Eliminar el jobId de la lista de appliedJobs del candidato

        // Guardar los cambios en la base de datos
        await job.save();

        // Retornar un estatus 200 y un mensaje de éxito
        res.status(200).json({
            status: 'Succeeded',
            data: 'La inscripción a la oferta de trabajo ha sido eliminada exitosamente',
            error: null,
        });
    } catch (error) {
        // Si hay un error en la eliminación de la inscripción, se retorna un estatus 500 y un mensaje de error
        res.status(500).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// Envio de correo de aprobación/rechazo de oferta de trabajo

const email = async (req, res) => {
    const toSend = {
        email: req.body.email,
        name: req.body.name,
        job: req.body.job,
        acepted: req.body.acepted,
        refused: req.body.refused,
    };

    try {
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'laughingoutloud90@gmail.com',
                pass: 'xwnmvqzcrgaykdip',
            },
            tls: {
                rejectUnauthorized: false,
            },
        };
        let msg = {
            from: '"Codejobs" <codejobs@example.com>',
            to: toSend.email,
            subject: 'Oferta de trabajo codejobs',
            text: `Hola ${
                toSend.name
            }, te informamos que tu solicitud para el puesto ${
                toSend.job
            } ha sido ${
                toSend.acepted ? toSend.acepted : toSend.refused
            }. Comunicate con administración de codespace para obener más información.`,
        };

        const transport = nodemailer.createTransport(config);
        await transport.sendMail(msg);
        res.json({ status: 'success', data: null, error: null });
    } catch (error) {
        return res
            .status(404)
            .json({ status: 'failed', data: null, error: error.message });
    }
};

// @Desc: This function gets all the jobs that the candidate has applied to, filtering by the loginId of the candidate (for the applied Jobs page)
// @Route: GET /job/candidate-applied-jobs/:loginId
// @Access: Private
const getCandidateAppliedJobs = async (req, res) => {
    try {
        const loginId = req.params.loginId;
        // Find the candidate and check if it exists
        const candidate = await Candidate.findOne({
            $or: [{ _id: loginId }, { loginId: loginId }],
        }).exec();
        const data = await Job.find(
            { applicants: { $elemMatch: { applicantId: candidate._id } } },
            {
                location: 1,
                salary: 1,
                jobType: 1,
                title: 1,
                company: 1,
                jobActive: 1,
                applicants: 1,
            },
        ).populate({
            path: 'company',
            select: 'logo companyName',
            model: 'Employer',
        });

        res.status(200).json({
            status: 'Succeeded',
            data,
            error: null,
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// @Desc: This function deletes a candidate from the applicants array of the job and deletes the job from the appliedJobs array of the candidate, using the params loginId and jobId (for the applied Jobs page)
// @Route: DELETE /job/candidate-applied-jobs/:loginId/:jobId
// @Access: Private

const deleteCandidateAppliedJobs = async (req, res) => {
    // Transform the params loginId and jobId to ObjectId
    const loginId = req.params.loginId;
    const jobId = req.params.jobId;
    try {
        // Find the job and check if it exists
        const job = await Job.findOne({ _id: jobId });

        if (!job) {
            return res.status(404).json({
                status: 'Failed',
                data: null,
                error: 'Job not found',
            });
        }

        // Find the candidate and check if it exists
        const candidate = await Candidate.findOne({
            $or: [{ _id: loginId }, { loginId: loginId }],
        }).exec();
        if (!candidate) {
            return res.status(404).json({
                status: 'Failed',
                data: null,
                error: 'Candidate not found',
            });
        }

        // Check if the candidate has applied to the job
        const applicant = job.applicants.findIndex(
            (applicant) =>
                applicant.applicantId.toString() === candidate._id.toString(),
        );

        if (applicant === -1) {
            return res.status(404).json({
                status: 'Failed',
                data: null,
                error: 'Applicant not found for the selected job',
            });
        }
        // Delete the candidate from the applicants array of the job
        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobId },
            { $pull: { applicants: { applicantId: candidate._id } } },
            { new: true },
        );

        res.status(200).json({
            status: 'Succeeded',
            data: 'Delete successfully',
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            data: null,
            error: error.message,
        });
    }
};

// @Desc Add a candidate to the applicants array of a job and add the job to the appliedJobs array of the candidate
// @Route POST /job/job-single/:loginId/:jobId
// @Access Private

const applyToJob = async (req, res) => {
    const loginId = req.params.loginId;
    const jobId = req.params.jobId;

    try {
        // Check if the job exists
        const job = await Job.findOne({ _id: jobId });

        if (!job) {
            return res.status(400).json({
                status: 'Failed',
                message: 'No se encontró la información del trabajo',
                data: null,
            });
        }

        // Check if the candidate exists
        const candidate = await Candidate.findOne({
            $or: [{ _id: loginId }, { loginId: loginId }],
        }).exec();
        if (!candidate) {
            return res.status(400).json({
                status: 'Failed',
                message: 'No se encontró la información del candidato',
                data: null,
            });
        }

        // Check if the candidate already exists in the applicants array of the job
        const applicantExists = await Job.findOne({
            _id: jobId,
            'applicants.applicantId': candidate._id,
        });

        if (applicantExists) {
            // if the candidate already exists in the applicants array of the job, update the applicationDate
            await Job.updateOne(
                { _id: jobId, 'applicants.applicantId': candidate._id },
                { $set: { 'applicants.$.applicationDate': Date.now() } },
            );
        } else {
            // if the candidate does not exist in the applicants array of the job, add it to the applicants array
            await Job.findOneAndUpdate(
                { _id: jobId },
                {
                    $push: {
                        applicants: {
                            applicantId: candidate._id,
                            applicationDate: Date.now(),
                        },
                    },
                },
            );
        }

        return res.status(200).json({
            status: 'Succeeded',
            message:
                'Se agregó el candidato a la lista applicants y se agregó el trabajo a la lista appliedJobs',
            data: null,
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({
            status: 'Failed',
            message:
                'Error al agregar el candidato a la lista applicants o al agregar el trabajo a la lista appliedJobs',
            data: null,
        });
    }
};

module.exports = {
    getAllJobs,
    getEmployerJobsByLoginId,
    removeJobByLoginIdAndJobId,
    updateJobByLoginIdAndJobId,
    getJobsAppliedByLoginId,
    removeJobApplication,
    getJobList,
    createJob,
    getJobByJobId,
    email,
    getCandidateAppliedJobs,
    deleteCandidateAppliedJobs,
    applyToJob,
};
