// Require necessary modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.static('public'));
// This middleware is essential for parsing the JSON body of POST requests
app.use(express.json());

// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/myBudgetDB')
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('Connection error:', err));

// Define the Mongoose Schema for your budget data
const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    relatedValue: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
        // Enforce the color is a 6-digit hex code (e.g., #A1B2C3)
        validate: {
            validator: function(v) {
                return /^#[0-9a-fA-F]{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid 6-digit hex color!`
        }
    }
});

// Create a Mongoose Model from the schema
// Mongoose automatically creates a collection named 'budgetitems' (plural and lowercase)
const BudgetItem = mongoose.model('BudgetItem', budgetSchema);

// Define your API Endpoints
app.get('/budget', async (req, res) => {
    try {
        const data = await BudgetItem.find({});
        res.json(data);
    } catch (error) {
        res.status(500).send('Server error while fetching data');
    }
});

app.post('/budget', async (req, res) => {
    try {
        const newItem = new BudgetItem(req.body);
        await newItem.save();
        res.status(201).send('New budget item added successfully!');
    } catch (error) {
        // This will catch validation errors (e.g., bad color format, missing title)
        res.status(400).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});