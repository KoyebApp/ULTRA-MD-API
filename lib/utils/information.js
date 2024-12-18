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
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${kota}&units=${units}&appid=${APIKey}`;
        const response = await axios.get(url);

        const cuaca = response.data;
        const result = {
            status: true,
            code: 200,
            creator: "@only_fxc7",
            Nama: `${cuaca.name}, ${cuaca.sys.country}`,
            Longitude: cuaca.coord.lon,
            Latitude: cuaca.coord.lat,
            Suhu: `${cuaca.main.temp} C`,
            Angin: `${cuaca.wind.speed} m/s`,
            Kelembaban: `${cuaca.main.humidity}%`,
            Cuaca: cuaca.weather[0].main,
            Keterangan: cuaca.weather[0].description,
            Udara: `${cuaca.main.pressure} HPa`
        };

        return result;
    } catch (err) {
        console.error('Error fetching weather:', err.message); // Log error
        throw new Error('Error fetching weather: ' + err.message); // Throw error but prevent app crash
    }
};

module.exports = { Cuaca, Lirik };
