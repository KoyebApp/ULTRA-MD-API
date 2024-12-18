const needle = require('needle');
const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
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
          creator: 'Qasim Ali',
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
async function tiktokDl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = [];
      
      // Function to format numbers (e.g., for views, likes)
      function formatNumber(integer) {
        let numb = parseInt(integer);
        return Number(numb).toLocaleString().replace(/,/g, '.');
      }

      // Function to format date
      function formatDate(n, locale = 'en') {
        let d = new Date(n);
        return d.toLocaleDateString(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        });
      }

      // TikTok API endpoint
      let domain = 'https://www.tikwm.com/api/';
      
      // Sending request to fetch TikTok metadata
      let response = await axios.post(domain, {}, {
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'https://www.tikwm.com',
          'Referer': 'https://www.tikwm.com/',
          'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
          'Sec-Ch-Ua-Mobile': '?1',
          'Sec-Ch-Ua-Platform': 'Android',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        },
        params: {
          url: url,
          count: 12,
          cursor: 0,
          web: 1,
          hd: 1
        }
      });

      // Check if the response data exists
      const res = response.data?.data;
      if (!res) {
        return reject(new Error('Invalid response data or no data found'));
      }

      // Processing response data
      if (res.size === undefined) {
        // If no size, handle as image or different content type
        if (res.images && Array.isArray(res.images)) {
          res.images.forEach(image => {
            data.push({ type: 'photo', url: image });
          });
        }
      } else {
        // If size exists, process video data
        data.push({
          type: 'watermark',
          url: 'https://www.tikwm.com' + res.wmplay,
        }, {
          type: 'nowatermark',
          url: 'https://www.tikwm.com' + res.play,
        }, {
          type: 'nowatermark_hd',
          url: 'https://www.tikwm.com' + res.hdplay
        });
      }

      // Structuring the response
      let json = {
        status: true,
        title: res.title,
        taken_at: formatDate(res.create_time).replace('1970', ''),
        region: res.region,
        id: res.id,
        durations: res.duration,
        duration: res.duration + ' Seconds',
        cover: 'https://www.tikwm.com' + res.cover,
        size_wm: res.wm_size,
        size_nowm: res.size,
        size_nowm_hd: res.hd_size,
        data: data,
        music_info: {
          id: res.music_info.id,
          title: res.music_info.title,
          author: res.music_info.author,
          album: res.music_info.album || null,
          url: 'https://www.tikwm.com' + res.music || res.music_info.play
        },
        stats: {
          views: formatNumber(res.play_count),
          likes: formatNumber(res.digg_count),
          comment: formatNumber(res.comment_count),
          share: formatNumber(res.share_count),
          download: formatNumber(res.download_count)
        },
        author: {
          id: res.author.id,
          fullname: res.author.unique_id,
          nickname: res.author.nickname,
          avatar: 'https://www.tikwm.com' + res.author.avatar
        }
      };

      resolve(json);
    } catch (e) {
      reject(new Error(`Error fetching TikTok video: ${e.message}`));
    }
  });
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
  Tiktok: tiktokDl
};
