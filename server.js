const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory (optional)
app.use(express.static('public')); // You can place your HTML and CSS in a 'public' folder if you want

// Your Google Sheet ID and API Key
const SHEET_ID = '119pazdyPllZwwWquhKjS-L9GLEG3P325-m5YIYh2qrI';
const API_KEY = 'AIzaSyDw7_jg0PT8Z4tnyvY0Vm-BWxoXK9sjhW4';

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html
});

// Endpoint to get advice based on selected mood
app.get('/api/advice', async (req, res) => {
    const moodName = req.query.mood;
    if (!moodName) {
        return res.status(400).send('Mood name is required');
    }

    try {
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        const moods = response.data.values.slice(1); // Skip header row

        // Find the mood and corresponding advice
        const moodEntry = moods.find(row => row[0].toLowerCase() === moodName.toLowerCase());
        if (moodEntry) {
            const advice = {
                mood: moodEntry[0], // Mood Name
                advice: moodEntry[1], // Mismatched Advice
                alternateAdvice: moodEntry[2] // Annoying Alternate Advice
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
