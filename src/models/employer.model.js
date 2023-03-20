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
    },
    phone: {
        type: String,
    },
    website: {
        type: String,
    },
    isLookingForEmployees: {
        type: Boolean,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
