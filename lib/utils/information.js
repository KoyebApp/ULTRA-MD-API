const axios = require("axios");
const request = require('request');
const dotenv = require('dotenv').config()
const APIKey = process.env.APIkey || 'CYFESHGDkTwnn9r0Aky9ElxieTbieTlRrHF6KB2A7TCDHBAKg6bTn2Dy74AOmLJA';
const units = 'metric';
const Genius = require("genius-lyrics");
const Client = new Genius.Client(process.env.GENIUS_KEY || 'fCb0orOa0Klh43SaVSOOFQcDbex98WTzRRuj_ybh4gKXlNwyTAiYs3Gos_5aTWU18KAwiKur71YI-_9_22Iqyg');

// Function to fetch lyrics for a given song
async function cari(musik) {
    try {
        if (!musik) {
            throw new Error('No music query provided.');
        }

        // Checking if the API key is valid
        const apiKeyValid = await checkApiKey();
        if (!apiKeyValid) {
            throw new Error('Invalid API key.');
        }

        // Searching for the song
        const searches = await Client.songs.search(musik).catch(err => { 
            throw new Error('Error searching song: ' + err);
        });

        if (!searches || searches.length === 0) {
            throw new Error('No song found for the provided query.');
        }

        const firstSong = searches[0];

        if (!firstSong || !firstSong.lyrics) {
            throw new Error('Lyrics not available for this song.');
        }

        const lyrics = await firstSong.lyrics() + "\n"; // Fetch lyrics
        return lyrics;

    } catch (error) {
        console.error('Error in cari function:', error);
        throw new Error('Error fetching lyrics: ' + error.message);
    }
}

// Checking if the API key is valid
async function checkApiKey() {
    try {
        // Test API call to check validity of API key
        const response = await axios.get(`https://api.genius.com/songs/3781949`, {
            headers: {
                'Authorization': `Bearer ${process.env.GENIUS_KEY || 'fCb0orOa0Klh43SaVSOOFQcDbex98WTzRRuj_ybh4gKXlNwyTAiYs3Gos_5aTWU18KAwiKur71YI-_9_22Iqyg'}`
            }
        });
        
        // If the response is valid, we consider the API key to be correct
        return response.status === 200;

    } catch (error) {
        console.error('Error validating API key:', error.message);
        return false;
    }
}

// Function to fetch weather information
const Cuaca = (kota) => {
    return new Promise((resolve, reject) => {
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${kota}&units=${units}&appid=${APIKey}`;
        request(url, async function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                const cuaca = JSON.parse(body);
                const result = {
                    status: true,
                    code: 200,
                    creator: "@only_fxc7",
                    Nama: cuaca.name + ',' + cuaca.sys.country,
                    Longitude: cuaca.coord.lon,
                    Latitude: cuaca.coord.lat,
                    Suhu: cuaca.main.temp + " C",
                    Angin: cuaca.wind.speed + " m/s",
                    Kelembaban: cuaca.main.humidity + "%",
                    Cuaca: cuaca.weather[0].main,
                    Keterangan: cuaca.weather[0].description,
                    Udara: cuaca.main.pressure + " HPa"
                };
                resolve(result);
            }
        });
    });
};

// Promise to return lyrics
const Lirik = (musik) => new Promise((resolve, reject) => {
    if (!musik) { 
        reject('Lirik Lagu Tidak Di Temukan.');
    }
    cari(musik)
        .then(data => {
            resolve({ data });
        })
        .catch(err => {
            reject(err);
        });
});

// Export functions
module.exports = { Cuaca, Lirik };

