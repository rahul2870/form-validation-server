const { default: mongoose } = require("mongoose");

const formSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/,
        minlength: 2,
        maxlength: 30,
    },
    last_name: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Others'],
    },
    dob: {
        type: Date,
        required: true,
    },
});
const FormModel = mongoose.model('register', formSchema);

module.exports = FormModel;