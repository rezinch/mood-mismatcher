const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const SHEET_ID = '1tvzaiGV78A73pxnm3Ic-R1YmdUinDDh0rO45dyRg5Rk'; // Replace with your Sheet ID
const API_KEY = 'AIzaSyDw7_jg0PT8Z4tnyvY0Vm-BWxoXK9sjhW4'; // Replace with your Google Sheets API key

app.get('/api/advice', async (req, res) => {
    const moodName = req.query.mood;
    if (!moodName) {
        return res.status(400).send('Mood name is required');
    }

    try {
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        console.log(response.data.values); // Check the Google Sheets data structure
        const moods = response.data.values.slice(1); // Skip header row

        const moodEntry = moods.find(row => row[0].toLowerCase() === moodName.toLowerCase());
        if (moodEntry) {
            const advice = {
                mood: moodEntry[0],
                primaryAdvice: moodEntry[1],
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
