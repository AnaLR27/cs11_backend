const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    loginId: {
        type: Schema.Types.ObjectId,
        ref: 'Login',
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    specialty: {
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
    bootcamp: {
        type: String,
        required: true,
    },
    edition: {
        type: Number,
        required: true,
    },

    languages: [
        {
            type: String,
            required: true,
        },
    ],
    socialNetworks: {
        linkedin: String,
        github: String,
    },
    description: {
        type: String,
        required: true,
    },
    professionalSkills: [
        {
            type: String,
            enum: [
                'HTML',
                'CSS',
                'JavaScript',
                'React',
                'Angular',
                'Vue',
                'Node',
                'Express',
                'MongoDB',
                'MySQL',
                'Python',
                'Java',
                'C#',
                'C++',
                'C',
                'PHP',
                'Git',
                'GitHub',
                'BitBucket',
                'Docker',
                'Kubernetes',
                'AWS',
                'Azure',
                'Jira',
                'Diseño UX/UI',
                'WordPress',
                'Android',
                'iOS',
                'Otros',
            ],
        },
    ],
    isLookingForJob: {
        type: Boolean,
        required: true,
    },
    resume: {
        type: String,
    },
    photo: {
        type: String,
    },
    watchlist: [
        {
            employerId: {
                type: Schema.Types.ObjectId,
                ref: 'Employer',
                required: true,
            },
            lastUpdate: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
