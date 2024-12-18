const needle = require('needle');
const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const tikdown = require('nayan-videos-downloader'); // TikTok downloader from 'nayan-videos-downloader'

// Custom fbvdl function for Facebook video download
async function fbvdl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('https://www.getfvid.com/downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Referer: 'https://www.getfvid.com/',
        },
        body: new URLSearchParams({
          url: url,
        }),
      });
      
      const body = await response.text();
      const $ = cheerio.load(body);
      
      resolve({
        result: {
          creator: 'Guru sensei',
          url: url,
          title: $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a').text(),
          time: $('#time').text(),
          hd: $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a').attr('href'),
          sd: $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a').attr('href'),
          audio: $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(3) > a').attr('href'),
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to fetch and download TikTok video using nayan-videos-downloader
async function getTikTokVideo(url) {
  try {
    // Fetch media data using tikdown (nayan-videos-downloader)
    const mediaData = await tikdown(url);
    console.log('Media Data:', mediaData);

    // Check if the media data has a valid video URL
    if (!mediaData.data || !mediaData.data.video) {
      throw new Error('Could not fetch the video URL');
    }

    const videoUrl = mediaData.data.video;
    console.log('Video URL:', videoUrl);

    // Fetch the media content from the download URL
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch the media content');
    }

    // Process the video content (e.g., save it or stream it)
    const videoBuffer = await response.buffer();  // Get the video as a buffer

    // Save video to file (optional)
    // fs.writeFileSync('tiktok_video.mp4', videoBuffer);
    console.log('Video downloaded successfully!');
  } catch (error) {
    console.error('Error fetching TikTok video:', error);
  }
}

// Joox music search function
async function getJooxMusic(query) {
  try {
    const time = Math.floor(new Date() / 1000);

    // Search for songs on Joox using the API
    const { data } = await axios.get(`http://api.joox.com/web-fcgi-bin//web_search?lang=id&country=id&type=0&search_input=${query}&pn=1&sin=0&ein=29&_=${time}`);
    let result = [];
    let promoses = [];
    let ids = [];

    // Extract song IDs
    data.itemlist.forEach(item => {
      ids.push(item.songid);
    });

    // Get detailed song info for each ID
    for (let i = 0; i < data.itemlist.length; i++) {
      const songId = ids[i];
      const songInfoUrl = `http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=${songId}`;
      promoses.push(
        axios.get(songInfoUrl, {
          headers: {
            Cookie: 'wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;'
          }
        })
        .then(({ data }) => {
          const res = JSON.parse(data.replace('MusicInfoCallback(', '').replace('\n)', ''));
          result.push({
            song: res.msong,
            album: res.malbum,
            artist: res.msinger,
            publishDate: res.public_time,
            image: res.imgSrc,
            mp3Url: res.mp3Url
          });
        })
        .catch(error => {
          console.error('Error fetching song info:', error);
        })
      );
    }

    // Fetch lyrics for each song
    for (let i = 0; i < data.itemlist.length; i++) {
      const songId = ids[i];
      const lyricsUrl = `http://api.joox.com/web-fcgi-bin/web_lyric?musicid=${songId}&lang=id&country=id&_=${time}`;
      promoses.push(
        axios.get(lyricsUrl)
          .then(({ data }) => {
            const lyrics = JSON.parse(data.replace('MusicJsonCallback(', '').replace('\n)', '')).lyric;
            const buff = Buffer.from(lyrics, 'base64');
            const decodedLyrics = buff.toString('utf-8');
            result[i].lyrics = decodedLyrics;
          })
          .catch(error => {
            console.error('Error fetching lyrics:', error);
          })
      );
    }

    // Wait for all requests to complete and return result
    await Promise.all(promoses);
    return {
      status: true,
      code: 200,
      creator: '@only_fxc7',
      results: result
    };

  } catch (error) {
    console.error('Error with Joox search:', error);
    throw error;
  }
}

// Exporting the functions as per your request
module.exports = {
  Joox: getJooxMusic,
  FB: fbvdl,
  Tiktok: getTikTokVideo
};
