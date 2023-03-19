const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Employer',
        required: true,
    },
    location: {
        country: {
            type: String,
            required: true,
            enum: [
                'España',
                'EEUU',
                'Alemania',
                'Reino Unido',
                'Francia',
                'Italia',
            ],
            default: 'España',
        },
        city: {
            type: String,
            required: true,
            enum: [
                'Álava',
                'Albacete',
                'Alicante',
                'Almería',
                'Asturias',
                'Ávila',
                'Badajoz',
                'Barcelona',
                'Burgos',
                'Cáceres',
                'Cádiz',
                'Cantabria',
                'Castellón',
                'Ciudad Real',
                'Córdoba',
                'Cuenca',
                'Gerona',
                'Granada',
                'Guadalajara',
                'Guipúzcoa',
                'Huelva',
                'Huesca',
                'Islas Baleares',
                'Jaén',
                'La Coruña',
                'La Rioja',
                'Las Palmas',
                'León',
                'Lérida',
                'Lugo',
                'Madrid',
                'Málaga',
                'Murcia',
                'Navarra',
                'Orense',
                'Palencia',
                'Pontevedra',
                'Salamanca',
                'Santa Cruz de Tenerife',
                'Segovia',
                'Sevilla',
                'Soria',
                'Tarragona',
                'Teruel',
                'Toledo',
                'Valencia',
                'Valladolid',
                'Vizcaya',
                'Zamora',
                'Zaragoza',
            ],
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    salary: {
        type: Number,
        required: true,
    },
    specialtyJob: {
        type: String,
        required: true,
        enum: [
            'Desarrollador Web',
            'Desarrollador Móvil',
            'Data Science',
            'UX/UI',
            'DevOps',
            'Ciberseguridad',
            'Marketing',
            'Ventas',
            'Otros',
        ],
        default: 'Desarrollador Web',
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Presencial', 'Remoto', 'Híbrido'],
    },
    workDay: {
        type: String,
        required: true,
        enum: ['Jornada Completa', 'Jornada Parcial'],
    },
    jobActive: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true,
    },

    applicants: [
        {
            applicantId: {
                type: Schema.Types.ObjectId,
                ref: 'Candidate',
            },
            applicationDate: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
