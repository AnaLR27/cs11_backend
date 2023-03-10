const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Job = require("../models/job.model.js");
const Employer = require("../models/employer.model.js");
const Candidate = require("../models/candidate.model.js");
const Login = require("../models/auth.model.js");
const asyncHandler = require("express-async-handler");

// @Desc Obtener todas las ofertas de trabajo
// @Route GET /job/all-jobs
// @Access Privado
const getAllJobs = async (req, res) => {
  try {
    // Buscar todas las ofertas de trabajo activas y populadas por la empresa
    const jobs = await Job.find({ jobActive: true });
    // Enviar una respuesta exitosa con los datos de las ofertas de trabajo
    res.status(200).json({ status: "Succeeded", data: jobs, error: null });
  } catch (error) {
    // Enviar una respuesta con error en caso de que ocurra algún problema
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
};

// @Desc Obtener todos los trabajos de un empleador por su loginId
// @Route GET /job/employer-jobs/:loginId
// @Access Privado
const getEmployerJobsByLoginId = async (req, res) => {
  try {
    //Obtener el id del token
    const authHeader = req.header("auth-token") || req.header("Auth-token");
    const token = authHeader;

    const decodedToken = jwt_decode(token);
    const loginId = req.params.loginId;

    // Buscar la información de la compañía
    const company = await Employer.findOne({
      loginId,
    });

    // Buscar todas las ofertas de trabajo de la compañía
    const jobs = await Job.find(
      {},
      {
        company: 1,
        companyName: 1,
        title: 1,
        jobType: 1,
        logo: 1,
        _id: 1,
        location: 1,
        applicants: 1,
        createdAt: 1,
      }
    );
    console.log(jobs);

    // Retornar un estatus 200 y los datos de las ofertas de trabajo
    res.status(200).json({ status: "Succeeded", data: jobs, error: null });
  } catch (error) {
    // Si hay un error en la búsqueda, retornar un estatus 404 y un mensaje de error
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
};

// @Desc Eliminar un trabajo de un determinado empleador por su loginId y jobId
// @Route DELETE /job/delete-job/:loginId/:jobId
// @Access Privado
const removeJobByLoginIdAndJobId = async (req, res) => {
  try {
    // Verificar el token del usuario
    const authHeader = req.header("auth-token") || req.header("Auth-token");
    const token = authHeader;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Verificar si el usuario loggeado es un empleador
    if (decodedToken.UserInfo.role !== "employer") {
      return res.status(401).json({
        status: "Failed",
        error: "No tienes permiso para realizar esta acción",
        data: null,
      });
    }

    // Obtener el loginId y jobId del empleador a partir de la URL
    const loginId = req.params.loginId;
    const jobId = req.params.jobId;

    console.log(jobId)
    // Verificar que el empleador loggeado es el dueño del trabajo
    const job = await Job.findOne({ loginId, _id: jobId });
    if (!job) {
      return res.status(400).json({
        status: "Failed",
        error: "No se encontró el trabajo especificado",
        data: null,
      });
    }
    if (decodedToken.UserInfo.id !== job.company.toString()) {
      console.log(decodedToken.UserInfo.id);
      console.log(job.company);
      return res.status(403).json({
        status: "Failed",
        error: "No tienes permiso para eliminar este trabajo",
        data: null,
      });
    }


    // Eliminar el trabajo
    const deletedJob = await Job.findOneAndDelete({
      loginId: loginId,
      _id: jobId,
    });

    // Eliminar el jobId del array jobs del employer
    await Employer.updateOne(
      { _id: decodedToken.UserInfo.id },
      { $pull: { jobs: jobId } }
    );

    return res.status(200).json({
      status: "Succeeded",
      error: null,
      data: deletedJob,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      error: "Error al eliminar el trabajo",
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
    const authHeader = req.header("auth-token") || req.header("Auth-token");
    const token = authHeader;
    const decodedToken = jwt_decode(token);

    // Obtener el loginId y el jobId de los parámetros de la ruta
    const loginId = req.params.loginId;
    const jobId = req.params.jobId;

    // Comprobar que el loginId del token coincide con el loginId de la ruta
    if (decodedToken.UserInfo.id !== loginId) {
      return res.status(401).json({
        status : "Failed",
        message: "No tienes permiso para editar este trabajo",
        data: null,
      });
    }

    // Buscar la información del trabajo a editar
    const job = await Job.findOne({
      loginId: loginId,
      _id: jobId,
    });

    // Comprobar que el trabajo existe
    if (!job) {
      return res.status(400).json({
        status : "Failed",
        message: "No se encontró la información del trabajo",
        data: null,
      });
    }

    // Actualizar la información del trabajo
    const updatedJob = await Job.findOneAndUpdate(
      { loginId: loginId, _id: jobId },
      { $set: req.body },
      { new: true }
    );

    // Enviar una respuesta exitosa con los datos actualizados del trabajo
    res
      .status(200)
      .json({ status: "Succeeded", data: updatedJob, error: null });
  } catch (error) {
    // Enviar una respuesta con error en caso de que ocurra algún problema
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
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
      }
    ).populate({
      // Popular la información de la compañía relacionada
      path: "company",
      select: "logo companyName",
      model: "Employer",
    }); // Retornar un estatus 200 y los datos encontrados
    res.status(200).json({ status: "Succeeded", data: jobs, error: null });
  } catch (error) {
    // Si hay un error en la búsqueda, retornar un estatus 404 y un mensaje de error
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
  }
};

// @Desc Crear un nuevo trabajo
// @Route POST /job/post-job
// @Acceso Privado
const createJob = async (req, res) => {
  try {
    // Verificar el token del usuario
    const authHeader = req.header("auth-token") || req.header("Auth-token");
    const token = authHeader;

    const decodedToken = jwt_decode(token);

    // Obtener los datos del usuario
    const { title, description, location, salary, jobType, jobActive } =
      req.body;
    const createdAt = new Date();

    // Buscar la información de la compañía
    const company = await Employer.findOne({
      loginId: decodedToken.UserInfo.id,
    });
    if (!company) {
      return res.status(400).json({
        status: "Failed",
        message: "No se encontró la información de la compañía",
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
      company: company.loginId,
      companyName: company.companyName,
      logo: company.logo,
    });

    await newJob.save();

    // Actualizar la información del empleador
    await Employer.findByIdAndUpdate(company._id, {
      $push: { jobs: newJob._id.toString() },
    });

    return res.status(201).json({
      status: "Succeeded",
      message: "Oferta de trabajo creada exitosamente",
      data: newJob,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Error al crear la oferta de trabajo",
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
  const job = await Job.findById(jobId).exec();

  // Si la oferta de trabajo no se encuentra, se retorna un estatus 400 y un mensaje de error
  if (!job) {
    return res.status(400).json({
      status: "Failed",
      data: null,
      error: `No se encontró la oferta de trabajo con el id ${jobId}`,
    });
  }

  // Retornar un estatus 200 y la oferta de trabajo
  res.status(200).json({ status: "Succeeded", data: job, error: null });
};

// @Desc Obtiene ofertas de trabajo aplicadas por el loginId
// @Route GET /job/jobs-applied/:loginId
// @Access Privado
const getJobsAppliedByLoginId = async (req, res) => {
  try {
    const loginId = req.params.loginId;
    const candidate = await Candidate.findOne({ loginId }).populate('appliedJobs');
    const jobs = candidate.appliedJobs;

    console.log(candidate);
    console.log(jobs);

    res.status(200).json({
      status: "Succeeded",
      data: jobs,
      error: null,
    });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed", data: null, error: error.message });
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

    // Buscar el trabajo por su ID
    const job = await Job.findById(jobId);

    // Si el trabajo no se encuentra, se retorna un estatus 404 y un mensaje de error
    if (!job) {
      return res.status(404).json({
        status: "Failed",
        data: null,
        error: "No se encontró la oferta de trabajo con el jobId especificado",
      });
    }

    // Buscar si el loginId del candidato está en la lista de applicants
    const applicantIndex = job.applicants.findIndex(
      (applicant) => applicant.applicantId.toString() === loginId
    );

    // Si el candidato no se encuentra inscrito en el trabajo, se retorna un estatus 400 y un mensaje de error
    if (applicantIndex === -1) {
      return res.status(400).json({
        status: "Failed",
        data: null,
        error:
          "El usuario no se encuentra inscrito en la oferta de trabajo especificada",
      });
    }

    // Buscar el candidato en la base de datos usando el loginId
    const candidate = await Candidate.findOne({ loginId: loginId });

    // Si el candidato no se encuentra, se retorna un estatus 404 y un mensaje de error
    if (!candidate) {
      return res.status(404).json({
        status: "Failed",
        data: null,
        error: "No se encontró el candidato con el loginId especificado",
      });
    }

    // Eliminar el objeto del trabajo de la lista de jobsApplied del candidato
    const jobAppliedIndex = candidate.appliedJobs.indexOf(jobId);
    candidate.appliedJobs.splice(jobAppliedIndex, 1);

    // Eliminar el objeto del candidato de la lista de applicants
    job.applicants.splice(applicantIndex, 1);

    //Eliminar el jobId de la lista de appliedJobs del candidato

    // Guardar los cambios en la base de datos
    await job.save();
    await candidate.save();

    // Retornar un estatus 200 y un mensaje de éxito
    res.status(200).json({
      status: "Succeeded",
      data: "La inscripción a la oferta de trabajo ha sido eliminada exitosamente",
      error: null,
    });
  } catch (error) {
    // Si hay un error en la eliminación de la inscripción, se retorna un estatus 500 y un mensaje de error
    res.status(500).json({
      status: "Failed",
      data: null,
      error: error.message,
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
};
