const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(cors());

app.get('/budget', (req, res) => {
    fs.readFile(path.join(__dirname, 'budget.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to load budget data' });
        }
        res.json(JSON.parse(data));
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Served at http://localhost:${PORT}`);
});