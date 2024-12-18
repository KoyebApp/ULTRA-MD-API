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

// Cuaca function to fetch weather data
const Cuaca = async (kota) => {
    try {
        // Construct URL using the 'kota' variable
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`;

        // Fetch the weather data using axios
        const response = await axios.get(url);

        // Access weather data from the response
        const cuaca = response.data;

        // Prepare the result with only necessary details (not the full textw string)
        const result = {
            status: true,
            code: 200,
            creator: "Qasim Ali",
            weather: {
                main: cuaca.weather[0].main,
                description: cuaca.weather[0].description,
                temp: cuaca.main.temp,
                feels_like: cuaca.main.feels_like,
                pressure: cuaca.main.pressure,
                humidity: cuaca.main.humidity,
                wind_speed: cuaca.wind.speed,
                latitude: cuaca.coord.lat,
                longitude: cuaca.coord.lon,
                country: cuaca.sys.country
            }
        };

        // Return the result (JSON response)
        return result;
    } catch (err) {
        // Log error and throw a new error to prevent app crash
        console.error('Error fetching weather:', err.message);
        throw new Error('Error fetching weather: ' + err.message);
    }
};
module.exports = { Cuaca, Lirik };
