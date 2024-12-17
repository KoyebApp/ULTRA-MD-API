const TikTokScraper = require('tiktok-scraper');
const fbdl = require('fbdl-core');
const fs = require('fs');
const axios = require('axios');

// TikTok Video Data Function
async function TiktokData(url) {
    const videoMeta = await TikTokScraper.getVideoMeta(url);
    return ({
        status: true,
        code: 200,
        creator: "@only_fxc7",
        judul: videoMeta.collector[0].text,
        video_URL: {
            vid_wm: videoMeta.collector[0].videoUrl,
            vid_nowm: videoMeta.collector[0].videoUrlNoWaterMark
        }
    });
}

// TikTok Function with updated regex for shortened URLs
const Tiktok = (url) => new Promise((resolve, reject) => {
    if (!url || url === 'undefined') {
        return reject('Please provide a valid TikTok video URL.');
    }

    // TikTok URL Regex Pattern (Including shortened URLs like vm.tiktok.com)
    const tiktokUrlRegex = /(?:https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)|(?:https:\/\/vm\.tiktok\.com\/[\w.-]+)/;
    if (!tiktokUrlRegex.test(url)) {
        return reject("Invalid TikTok URL.");
    }

    try {
        TiktokData(url).then(data => {
            resolve(data);
        }).catch(err => {
            reject({
                code: 400,
                message: err.message
            });
        });
    } catch (error) {
        reject({
            code: 400,
            message: error.message
        });
    }
});

// Facebook Video Downloader Function with fs to save video
const FB = (url) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            return reject("Please provide a valid Facebook video URL.");
        }

        // Update regex to support Facebook URLs with share/v/ or share/r/
        const facebookUrlRegex = /(?:https:\/\/www\.facebook\.com\/(?:.*\/(?:v\/|r\/)?[a-zA-Z0-9]+\/))|(?:https:\/\/m\.facebook\.com\/(?:.*\/(?:v\/|r\/)?[a-zA-Z0-9]+\/))$/;
        
        // Test if the URL matches one of the supported formats
        if (!facebookUrlRegex.test(url)) {
            return reject("Invalid Facebook video URL.");
        }

        // Proceed to download the video
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
}

// Joox Music Search Function
async function Joox(query) {
    return new Promise((resolve, reject) => {
        const time = Math.floor(new Date() / 1000);
        axios.get('http://api.joox.com/web-fcgi-bin//web_search?lang=id&country=id&type=0&search_input=' + query + '&pn=1&sin=0&ein=29&_=' + time)
            .then(({ data }) => {
                let result = [];
                let hasil = [];
                let promoses = [];
                let ids = [];
                data.itemlist.forEach(result => {
                    ids.push(result.songid);
                });
                for (let i = 0; i < data.itemlist.length; i++) {
                    const scrap = 'http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=' + ids[i];
                    promoses.push(
                        axios.get(scrap, {
                            headers: {
                                Cookie: 'wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;'
                            }
                        })
                            .then(({ data }) => {
                                const res = JSON.parse(data.replace('MusicInfoCallback(', '').replace('\n)', ''));
                                hasil.push({
                                    lagu: res.msong,
                                    album: res.malbum,
                                    penyanyi: res.msinger,
                                    publish: res.public_time,
                                    img: res.imgSrc,
                                    mp3: res.mp3Url
                                });

                                axios.get('http://api.joox.com/web-fcgi-bin/web_lyric?musicid=' + ids[i] + '&lang=id&country=id&_=' + time)
                                    .then(({ data }) => {
                                        const lirik = JSON.parse(data.replace('MusicJsonCallback(', '').replace('\n)', '')).lyric;
                                        const buff = Buffer.from(lirik, 'base64');
                                        const ash = buff.toString('utf-8');
                                        result.push({
                                            result: ash
                                        });
                                        Promise.all(promoses).then(() => resolve({
                                            status: true,
                                            code: 200,
                                            creator: '@only_fxc7',
                                            result: hasil[0],
                                            lirik: result[0]
                                        }));
                                    })
                                    .catch(reject);
                            })
                            .catch(reject)
                    );
                }
            })
            .catch(reject);
    });
}

module.exports = { Joox, FB, Tiktok };

// Test URLs for Facebook and TikTok
const testUrls = [
    'https://www.facebook.com/share/v/18mnWvU21S/',
    'https://www.facebook.com/share/r/19efxqsR2A/',
    'https://www.tiktok.com/@username/video/1234567890123456789',
    'https://vm.tiktok.com/ZS68kB6jH/',  // Shortened TikTok URL
    'https://www.tiktok.com/@username/video/9876543210987654321'
];

testUrls.forEach(url => {
    // Handle TikTok
    Tiktok(url)
        .then(response => console.log('TikTok Video Info:', response))
        .catch(error => console.error('TikTok Error:', error));

    // Handle Facebook
    FB(url)
        .then(response => console.log('Facebook Video Downloaded:', response))
        .catch(error => console.error('Facebook Error:', error));
});
                                            
