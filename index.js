const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const FormModel = require('./utils/models/form');
const moment = require('moment');
const { countryData, stateData, cityData } = require('./utils/db');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors())
// Connect to the MongoDB database
mongoose.connect('mongodb+srv://rahulkashyap2870:LlMcNIU7AgTC7YUq@cluster0.hdanpfx.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/', (req, res) => {
    res.send("working")
});

app.post("/get-country-state-city", (req, res) => {
    const { need, value } = req.body;
    switch (need) {
        case "country":
            res.json(countryData);
            break;

        case "state":
            if (value && stateData[value]) {
                res.json(stateData[value]);
            } else {
                res.status(400).json({ error: "Invalid country value provided" });
            }
            break;

        case "city":
            if (value && cityData[value]) {
                res.json(cityData[value]);
            } else {
                res.status(400).json({ error: "Invalid state value provided" });
            }
            break;

        default:
            res.status(400).json({ error: "Invalid request" });
    }
});

app.post(
    '/form',
    [
        body('first_name')
            .isAlpha()
            .withMessage('First name must contain only alphabets')
            .isLength({ min: 2, max: 30 })
            .withMessage('First name must be between 2 and 30 characters'),
        body('last_name')
            .isAlpha()
            .withMessage('Last name must contain only alphabets')
            .isLength({ min: 2, max: 30 })
            .withMessage('Last name must be between 2 and 30 characters'),
        body('email')
            .isEmail()
            .withMessage('Invalid email format'),
        body('gender')
            .notEmpty()
            .withMessage('Gender is required'),
        body('country')
            .notEmpty()
            .withMessage('country is required'),
        body('state')
            .notEmpty()
            .withMessage('State is required'),
        body('city')
            .notEmpty()
            .withMessage('City is required'),
        body('dob')
            .custom((value) => {
                const dob = moment(value, 'YYYY-MM-DD', true); // Parse date in 'YYYY-MM-DD' format
                if (!dob.isValid()) {
                    throw new Error('Select Your Date Of Birth.');
                }
                const age = moment().diff(dob, 'years');
                if (age >= 14) {
                    return true;
                }
                throw new Error('Date of Birth should be older than 14 years');
            }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const formData = req.body;
            const formEntry = new FormModel(formData);
            await formEntry.save();
            res.status(200).json({ message: 'Form submitted successfully!' });
        } catch (err) {
            // console.log("error : ", err)
            res.status(500).json({ error: 'Something went wrong on the server side' });
        }
    }
);

app.post('/get-form', async (req, res) => {
    try {
        const { id } = req.body;

        if (id) {
            // If an ID is provided, fetch the form with the given ID
            const form = await FormModel.findById(id);
            if (!form) {
                return res.status(404).json({ error: 'Form not found' });
            }
            return res.json(form);
        } else {
            // If no ID is provided, fetch all forms
            const forms = await FormModel.find({});
            return res.json(forms);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});
app.listen(PORT, () => {
    console.log("server is running")
});