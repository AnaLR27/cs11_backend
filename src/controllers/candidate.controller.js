const Candidate = require('../models/candidate.model');
const jwt_decode = require('jwt-decode');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { log } = require('console');

// @Desc Obtener todos los candidatos
// @Route GET /candidate/all-candidates
// @Acceso Privado
const getAllCandidates = async (req, res) => {
	// Buscar todos los candidatos en la base de datos
	const candidates = await Candidate.find({});

	// Retornar un estatus 200 y los datos de los candidatos
	res.status(200).json({ status: 'Succeeded', data: candidates, error: null });
};

// @Desc Obtener un candidato por su loginId
// @Route GET /candidate/:loginId
// @Acceso Privado
const getCandidateByLoginId = async (req, res) => {
	// Obtener el loginId del parámetro de la URL
	const loginId = req.params.loginId;

	// Buscar el candidato en la base de datos usando el loginId
	const candidate = await Candidate.findOne({ loginId: loginId });

	// Si el candidato no se encuentra, se retorna un estatus 404 y un mensaje de error
	if (!candidate) {
		return res.status(404).json({
			status: 'Failed',
			data: null,
			error: 'No se encontró el candidato con el loginId especificado',
		});
	}

	// Retornar un estatus 200 y la información del candidato
	res.status(200).json({ status: 'Succeeded', data: candidate, error: null });
};

// @Desc Agregar un candidato a la lista de seguimiento del empleador
// @Route POST /candidate/:loginId/watchlist
// @Acceso Privado
const addToWatchlist = async (req, res) => {
	try {
		// Verificar el token del usuario
		const authHeader = req.header('auth.token') || req.header('Auth-token');
		const token = authHeader;

		const decodedToken = jwt_decode(token);

		// Verificar si el usuario loggeado es un empleador
		if (decodedToken.UserInfo.role !== 'employer') {
			return res.status(401).json({
				status: 'Failed',
				message: 'No tienes permiso para realizar esta acción',
				data: null,
			});
		}

		// Obtener el loginId del candidato a partir de la URL
		const candidateId = req.params.loginId;
		console.log(candidateId);

		// Convertir el loginId a ObjectId
		const objectId = mongoose.Types.ObjectId(candidateId);

		// Buscar la información del candidato
		const candidate = await Candidate.findOne({ loginId: candidateId });
		if (!candidate) {
			return res.status(400).json({
				status: 'Failed',
				message: 'No se encontró la información del candidato',
				data: null,
			});
		}

		// Verificar si el employerId ya existe en la lista de seguimiento del candidato
		const employerExists = await Candidate.findOne({
			loginId: candidateId,
			'watchlist.employerId': decodedToken.UserInfo.id,
		});

		if (employerExists) {
			// Actualizar la fecha de lastUpdate
			await Candidate.updateOne(
				{
					loginId: candidateId,
					'watchlist.employerId': decodedToken.UserInfo.id,
				},
				{ $set: { 'watchlist.$.lastUpdate': Date.now() } },
			);
		} else {
			// Agregar el employerId a la lista de seguimiento del candidato
			await Candidate.findOneAndUpdate(
				{ loginId: candidateId },
				{
					$push: {
						watchlist: {
							employerId: decodedToken.UserInfo.id,
							lastUpdate: Date.now(),
						},
					},
				},
			);
		}

		return res.status(200).json({
			status: 'Succeeded',
			message: 'Candidato agregado a la lista de seguimiento',
			data: null,
		});
	} catch (error) {
		return res.status(500).json({
			status: 'Failed',
			message: 'Error al agregar el candidato a la lista de seguimiento',
			error,
		});
	}
};

/**
 * @Desc upload document
 *
 */
const diskstorage = multer.diskStorage({
	destination: path.join(__dirname, '../uploads/files'),
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

// Comprobar extensión y tamaño en el middleware
const fileUpload = multer({
	storage: diskstorage,
	limits: { fileSize: 5000000 },
	fileFilter: function (req, file, cb) {
		console.log(file.originalname);
		const splitName = file.originalname.split('.');
		const extension = splitName[splitName.length - 1];
		if (
			(file && extension === 'pdf') ||
			extension === 'doc' ||
			extension === 'docx'
		) {
			cb(null, true);
		} else {
			cb(new Error('No es un archivo pdf'));
		}
	},
}).single('file');

const modifyCandidate = async (loginId, pathFile) => {
	try {
		// Buscamos candidato al que hacerle la modificacion
		const data = await Candidate.findOne({ loginId: loginId }).exec();
		// Comprobar si la consulta ha devuelto datos
		if (!data) {
			console.log('Usuario no encontrado');
		}
		// Modificar campo resume del candidato
		data.resume = pathFile;
		// Guardamos el cambio en el candidato en la base de datos
		await data.save();
		console.log(data);
	} catch (error) {
		console.error('Ha ocurrido un error con la base de datos: ' + error);
	}
};

/**
 * Function to get candidate data by id.
 * @param { Request } req request data
 * @param { Response } res response data
 * @returns The response json object with the corresponding data.
 * @access private
 * @route [GET] - /candidate
 */
const getById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await Candidate.findOne({
			$or: [{ _id: id }, { loginId: id }],
		}).exec();
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
 * Function to create one candidate.
 * @param { Request } req request data
 * @param { Response } res response data
 * @returns The response json object with the corresponding data.
 * @access private
 * @route [POST] - /candidate/:id
 */
const createOne = async (req, res) => {
	try {
		const modelData = new Candidate(req.body);
		const data = await modelData.save();
		if (!data) {
			return res.status(404).json({
				status: 'failed',
				data: null,
				error: 'Usuario no creado',
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
 * Function to update candidate data.
 * @param { Request } req request data
 * @param { Response } res response data
 * @returns The response json object with the corresponding data.
 * @access private
 * @route [PATH] - /candidate/:candidateId/photo
 */
const updateById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await Candidate.findOneAndUpdate(
			{
				$or: [{ _id: id }, { loginId: id }],
			},
			req.body,
			{ new: true },
		).exec();
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
 * Function to upload an image file from candidate form record by id or loginId.
 * @param { Request } req request data
 * @param { Response } res response data
 * @returns Image file.
 * @access private
 * @route [POST] - /candidate/:candidateId/photo
 */
const uploadPhoto = async (req, res) => {
	try {
		const { candidateId } = req.params;
		// GET the image and check if exists.
		const data = await Candidate.findOne({
			$or: [{ _id: candidateId }, { loginId: candidateId }],
		}).exec();
		if (!data) {
			return res.status(404).json({
				status: 'failed',
				data: null,
				error: 'Usuario no encontrado',
			});
		}

		// If there is already an associated photo, we delete it.
		if (data.photo) {
			try {
				const filePath = './src/uploads/photos/' + data.photo;
				fs.unlinkSync(filePath);
			} catch (error) {}
		}
		// Get the file name
		const { path, filename, originalname } = req.file;
		let image = originalname;
		// Get the file extension
		const imageSplit = image.split('.');
		const extension = imageSplit[imageSplit.length - 1];

		// Check if the extension is valid, if not delete the extension.
		if (extension != 'png' && extension != 'jpg' && extension != 'jpeg') {
			const filePath = path;
			fs.unlinkSync(filePath);
			return res.status(404).json({
				status: 'error',
				message: 'Extensión no válida',
			});
		}
		// If image is correct, save it.
		data.photo = filename;
		data.markModified('photos');
		const saveResponse = await data.save();

		return res.status(200).json({
			success: true,
			message: 'Success',
			data: saveResponse,
			error: null,
			file: path,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ status: 'failed', data: null, error: error.message });
	}
};

/**
 * Function to download the image.
 * @param { Request } req request data
 * @param { Response } res response data
 * @returns Image file.
 * @access private
 * @route [GET] - /candidate/photo/:file
 */
const downloadPhoto = async (req, res) => {
	try {
		// Pull the parameters from the URL
		const { file } = req.params;
		// Mount the path with img file
		const filePath = './src/uploads/photos/' + file;
		console.log(file);
		// Check if the file exists
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
	getAllCandidates,
	getCandidateByLoginId,
	addToWatchlist,
	fileUpload,
	modifyCandidate,
	getById,
	createOne,
	updateById,
	uploadPhoto,
	downloadPhoto,
};
