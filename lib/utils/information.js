const axios = require('axios');
const dotenv = require('dotenv').config();
const APIKey = process.env.APIkey;
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
        const url =   `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`;
        const response = await axios.get(url);

        const cuaca = response.data;
        const result = {
            status: true,
            code: 200,
            creator: "Qasim Ali",
            let textw = ""
            textw += `*🗺️Weather of  ${text}*\n\n`
            textw += `*Weather:-* ${wdata.data.weather[0].main}\n`
            textw += `*Description:-* ${wdata.data.weather[0].description}\n`
            textw += `*Avg Temp:-* ${wdata.data.main.temp}\n`
            textw += `*Feels Like:-* ${wdata.data.main.feels_like}\n`
            textw += `*Pressure:-* ${wdata.data.main.pressure}\n`
            textw += `*Humidity:-* ${wdata.data.main.humidity}\n`
            textw += `*Humidity:-* ${wdata.data.wind.speed}\n`
            textw += `*Latitude:-* ${wdata.data.coord.lat}\n`
            textw += `*Longitude:-* ${wdata.data.coord.lon}\n`
            textw += `*Country:-* ${wdata.data.sys.country}\n`
        };

        return result;
    } catch (err) {
        console.error('Error fetching weather:', err.message); // Log error
        throw new Error('Error fetching weather: ' + err.message); // Throw error but prevent app crash
    }
};

module.exports = { Cuaca, Lirik };
