const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use(express.static('public'));


const SHEET_ID = process.env.SHEET_ID; // Set in Render
const API_KEY = process.env.API_KEY; // Set in Render

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});


app.get('/api/advice', async (req, res) => {
    const moodName = req.query.mood;
    if (!moodName) {
        return res.status(400).send('Mood name is required');
    }

    try {
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        const moods = response.data.values.slice(1); 

        
        const moodEntry = moods.find(row => row[0].toLowerCase() === moodName.toLowerCase());
        if (moodEntry) {
            const advice = {
                mood: moodEntry[0], 
                advice: moodEntry[1], 
                alternateAdvice: moodEntry[2] 
            };
            res.json(advice);
        } else {
            res.status(404).send('Mood not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from Google Sheets');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
