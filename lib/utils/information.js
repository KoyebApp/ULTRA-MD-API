const axios = require('axios');
const dotenv = require('dotenv').config();
const units = 'metric';
const Genius = require('genius-lyrics');
const Client = new Genius.Client(process.env.GENIUS_KEY);

// Helper function to fetch song lyrics
async function cari(musik) {
    try {
        const searches = await Client.songs.search(musik);
        if (!searches || searches.length === 0) {
            throw new Error('Song not found');
        }

        const firstSong = searches[0];
        const lyrics = await firstSong.lyrics();
        return lyrics + "\n";
    } catch (err) {
        console.error('Error fetching lyrics:', err.message); // Log error
        throw new Error('Error fetching lyrics: ' + err.message); // Throw error, but avoid crashing app
    }
}

// Return lyrics as a promise
const Lirik = (musik) => new Promise((resolve, reject) => {
    if (!musik) {
        reject('Lirik Lagu Tidak Di Temukan.');
    }

    cari(musik)
        .then(data => resolve({ data }))
        .catch(err => {
            console.error('Error in Lirik function:', err.message); // Log error
            reject(err.message); // Reject with error message but prevent app crash
        });
});

// Fetch weather data for a given city

const Cuaca = async (kota) => {
    try {
        // Construct URL using the 'kota' variable, not 'text'
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`;
        
        // Fetch the weather data using axios
        const response = await axios.get(url);

        // Access weather data from the response
        const cuaca = response.data;

        // Construct the 'textw' variable to display the weather details
        let textw = "";
        textw += `*🗺️Weather of ${kota}*\n\n`;
        textw += `*Weather:-* ${cuaca.weather[0].main}\n`;
        textw += `*Description:-* ${cuaca.weather[0].description}\n`;
        textw += `*Avg Temp:-* ${cuaca.main.temp}°C\n`;
        textw += `*Feels Like:-* ${cuaca.main.feels_like}°C\n`;
        textw += `*Pressure:-* ${cuaca.main.pressure} hPa\n`;
        textw += `*Humidity:-* ${cuaca.main.humidity}%\n`;
        textw += `*Wind Speed:-* ${cuaca.wind.speed} m/s\n`;
        textw += `*Latitude:-* ${cuaca.coord.lat}\n`;
        textw += `*Longitude:-* ${cuaca.coord.lon}\n`;
        textw += `*Country:-* ${cuaca.sys.country}\n`;

        // Create a result object to return
        const result = {
            status: true,
            code: 200,
            creator: "Qasim Ali",
            weatherDetails: textw
        };

        return result;
    } catch (err) {
        // Log error and throw new error to prevent app crash
        console.error('Error fetching weather:', err.message);
        throw new Error('Error fetching weather: ' + err.message);
    }
};

module.exports = { Cuaca, Lirik };
