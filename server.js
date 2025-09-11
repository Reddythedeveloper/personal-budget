const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.use(express.static('public'));


app.get('/budget', (req, res) => {
    fs.readFile(path.join('budget.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to load budget data' });
        }
        res.json(JSON.parse(data));
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});