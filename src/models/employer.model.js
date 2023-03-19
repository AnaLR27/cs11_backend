const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employerSchema = new Schema({
    loginId: {
        type: Schema.Types.ObjectId,
        ref: 'Login',
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    isLookingForEmployees: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
    },
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
