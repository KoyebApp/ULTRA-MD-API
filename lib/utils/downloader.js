const TikTokScraper = require('tiktok-scraper');
const fbdl = require('fbdl-core');
const axios = require('axios');
const fs = require('fs');

// TikTok Video Data Function
async function TiktokData(url) {
    try {
        const videoMeta = await TikTokScraper.getVideoMeta(url);
        return {
            status: true,
            code: 200,
            creator: "@only_fxc7",
            judul: videoMeta.collector[0].text,
            video_URL: {
                vid_wm: videoMeta.collector[0].videoUrl,
                vid_nowm: videoMeta.collector[0].videoUrlNoWaterMark
            }
        };
    } catch (error) {
        throw new Error('Error fetching TikTok video metadata: ' + error.message);
    }
}

// TikTok Function
const Tiktok = (url) => new Promise((resolve, reject) => {
    if (!url || url === 'undefined') {
        return reject('Please provide a valid TikTok URL.');
    }
    TiktokData(url).then(data => {
        resolve(data);
    }).catch(error => {
        reject({
            code: 400,
            message: error.message
        });
    });
});

// Facebook Video Downloader Function with fs to save video
const FB = (url) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            return reject("Please provide a valid Facebook video URL.");
        }

        fbdl.download(url)
            .then((res) => {
                const writeStream = fs.createWriteStream("./downloaded_video.mp4");

                res.pipe(writeStream);

                writeStream.on('finish', () => {
                    resolve({
                        status: true,
                        message: 'Download complete! The video is saved as "downloaded_video.mp4".'
                    });
                });

                writeStream.on('error', (err) => {
                    reject({
                        status: false,
                        message: 'Error while downloading the video: ' + err.message
                    });
                });
            })
            .catch((err) => {
                reject({
                    status: false,
                    message: 'Error fetching Facebook video: ' + err.message
                });
            });
    });
};

// Joox Music Search Function
async function Joox(query) {
    return new Promise((resolve, reject) => {
        const time = Math.floor(new Date() / 1000);
        axios.get(`http://api.joox.com/web-fcgi-bin//web_search?lang=id&country=id&type=0&search_input=${query}&pn=1&sin=0&ein=29&_=${time}`)
            .then(({ data }) => {
                let result = [];
                let promises = [];
                let ids = [];
                data.itemlist.forEach(item => {
                    ids.push(item.songid);
                });

                for (let i = 0; i < data.itemlist.length; i++) {
                    const scrap = `http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=${ids[i]}`;
                    promises.push(
                        axios.get(scrap, {
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
                                    publish_date: res.public_time,
                                    image: res.imgSrc,
                                    mp3_url: res.mp3Url
                                });

                                axios.get(`http://api.joox.com/web-fcgi-bin/web_lyric?musicid=${ids[i]}&lang=id&country=id&_=${time}`)
                                    .then(({ data }) => {
                                        const lyrics = JSON.parse(data.replace('MusicJsonCallback(', '').replace('\n)', '')).lyric;
                                        const buff = Buffer.from(lyrics, 'base64');
                                        const decodedLyrics = buff.toString('utf-8');
                                        result[i].lyrics = decodedLyrics;
                                    })
                                    .catch(reject);
                            })
                            .catch(reject)
                    );
                }

                Promise.all(promises).then(() => {
                    resolve({
                        status: true,
                        code: 200,
                        creator: '@only_fxc7',
                        songs: result
                    });
                });
            })
            .catch(reject);
    });
}

// Ensure unhandled promise rejections are caught globally
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally, handle cleanup here if necessary
});

module.exports = { Joox, FB, Tiktok };
