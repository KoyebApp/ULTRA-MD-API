__path = process.cwd();

// Required modules
const express = require('express');
const favicon = require('serve-favicon');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const request = require('request');
const zrapi = require('zrapi');
const fs = require('fs-extra');
const fg = require('api-dylux');
const { EmojiAPI } = require('emoji-api');
const dotenv = require('dotenv').config();
const { color, bgcolor } = require(__path + '/lib/color.js');
const { fetchJson } = require(__path + '/lib/fetcher.js');
const options = require(__path + '/lib/options.js');
const { Searchnabi, Gempa } = require('./../lib');
const {
  pShadow,
  pRomantic,
  pSmoke,
  pBurnPapper,
  pNaruto,
  pLoveMsg,
  pMsgGrass,
  pGlitch,
  pDoubleHeart,
  pCoffeCup,
  pLoveText,
  pButterfly
} = require("./../lib/utils/photooxy");

var { igStalk, igDownload } = require("./../lib/utils/ig");
var { ytDonlodMp3, ytDonlodMp4, ytPlayMp3, ytPlayMp4, ytSearch } = require("./../lib/utils/yt");
var { Joox, FB, Tiktok } = require("./../lib/utils/downloader");
var { Cuaca, Lirik } = require('./../lib/utils/information');
var { Base, WPUser } = require('./../lib/utils/tools');
var tebakGambar = require('./../lib/utils/tebakGambar');

// Ensure COOKIE environment variable is available
var cookie = process.env.COOCKIE;
if (!cookie) {
  console.error('COOKIE environment variable not found.');
}
const creator = 'Qasim Ali';

const createErrorMessage = (message) => ({
    status: false,
    creator: `${creator}`,
    code: 406,
    message: message
});

loghandler = {
    notparam: createErrorMessage('Please provide the apikey parameter'),
    noturl: createErrorMessage('Please provide the url parameter'),
    notquery: createErrorMessage('Please provide the query parameter'),
    notkata: createErrorMessage('Please provide the kata parameter'),
    nottext: createErrorMessage('Please provide the text parameter'),
    nottext2: createErrorMessage('Please provide the text2 parameter'),
    notnabi: createErrorMessage('Please provide the nabi parameter'),
    nottext3: createErrorMessage('Please provide the text3 parameter'),
    nottheme: createErrorMessage('Please provide the theme parameter'),
    notusername: createErrorMessage('Please provide the username parameter'),
    notvalue: createErrorMessage('Please provide the value parameter'),
    invalidKey: createErrorMessage('Invalid apikey'),
    invalidlink: {
        status: false,
        creator: `${creator}`,
        message: 'Error, the link might be invalid.'
    },
    invalidkata: {
        status: false,
        creator: `${creator}`,
        message: 'Error, the word might not exist in the API.'
    },
    error: {
        status: false,
        creator: `${creator}`,
        message: 'An error occurred.'
    }
}


/*
Akhir Pesan Error
*/
router.use(favicon(__path + "/views/favicon.ico"));

const listkey = ["Fxc7", "manogay"];

router.post("/apikey", async (req, res, next) => {
  const key = req.query.key;
  if (!key) {
    return res.json(loghandler.notparam);
  }
  
  if(listkey.includes(key)) {
    res.json({
      message: 'API key already registered'
    });
  } else {
    listkey.push(key);
    res.json({
      message: `Successfully registered ${key} in the API key database`
    });
  }
});

// delete apikey

router.delete("/apikey", async (req, res, next) => {
  const key = req.query.delete;
  
  if (!key) {
    return res.json(loghandler.notparam);
  }

  const index = listkey.indexOf(key);

  if (index === -1) {
    return res.json({
      message: 'API key does not exist'
    });
  }

  listkey.splice(index, 1);
  res.json({
    message: 'API key successfully deleted'
  });
});

router.get('/music/joox', async (req, res, next) => {
  const query = req.query.query;
  const apikey = req.query.apikey;

  if (!query) return res.json(loghandler.notquery);
  if (!apikey) return res.json(loghandler.notparam);

  if (listkey.includes(apikey)) {
    try {
      const result = await Joox(query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching Joox data:', error);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

router.get('/music/spotify', async (req, res, next) => {
  const apikey = req.query.apikey;
  const query = req.query.query;
  
  if (!apikey) return res.json(loghandler.notparam);
  if (!query) return res.json(loghandler.notquery);
  
  if (listkey.includes(apikey)) {
    try {
      const response = await fetch(encodeURI(`https://alpin-api-2021.herokuapp.com/api/spotify?apikey=alpin1&q=${query}`));
      const hasil = await response.json();
      res.json({
        status: true,
        creator: `${creator}`,
        result: hasil.data
      });
    } catch (e) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

router.get('/download/ytmp3', async (req, res, next) => {
  const url = req.query.url;
  const apikey = req.query.apikey;

  if (!url) return res.json(loghandler.noturl);
  if (!apikey) return res.json(loghandler.notparam);
  
  if (listkey.includes(apikey)) {
    try {
      const result = await ytDonlodMp3(url);
      res.json({
        status: true,
        code: 200,
        creator: `${creator}`,
        result
      });
    } catch (error) {
      console.error(error);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

router.get('/download/ytmp4', async (req, res, next) => {
  const url = req.query.url;
  const apikey = req.query.apikey;

  if (!url) return res.json(loghandler.noturl);
  if (!apikey) return res.json(loghandler.notparam);
  
  if (listkey.includes(apikey)) {
    try {
      const result = await ytDonlodMp4(url);
      res.json({
        status: true,
        code: 200,
        creator: `${creator}`,
        result
      });
    } catch (error) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

router.get("/yt/playmp3", async (req, res, next) => {
  const query = req.query.query;
  const apikey = req.query.apikey;

  if (!query) return res.json(loghandler.notquery);
  if (!apikey) return res.json(loghandler.notparam);

  if (listkey.includes(apikey)) {
    try {
      const result = await ytPlayMp3(query);
      res.json(result);
    } catch (error) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

router.get("/yt/playmp4", async (req, res, next) => {
  const query = req.query.query;
  const apikey = req.query.apikey;

  if (!query) return res.json(loghandler.notquery);
  if (!apikey) return res.json(loghandler.notparam);

  if (listkey.includes(apikey)) {
    try {
      const result = await ytPlayMp4(query);
      res.json(result);
    } catch (error) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

router.get('/yt/search', async (req, res, next) => {
  const query = req.query.query;
  const apikey = req.query.apikey;

  if (!query) return res.json(loghandler.notquery);
  if (!apikey) return res.json(loghandler.notparam);

  if (listkey.includes(apikey)) {
    try {
      const result = await ytSearch(query);
      res.json({
        status: true,
        code: 200,
        creator: `${creator}`,
        result
      });
    } catch (error) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// TikTok download route
router.get('/download/tiktok', async (req, res, next) => {
  const Apikey = req.query.apikey;
  const url = req.query.url;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
  if (!url) return res.json(loghandler.noturl);

  try {
    const data = await Tiktok(url);
    res.json(data);
  } catch (err) {
    res.json(loghandler.error);
  }
});

// Instagram download route
router.get('/download/ig', async (req, res, next) => {
  const url = req.query.url;
  const apikey = req.query.apikey;

  if (!url) return res.json(loghandler.noturl);
  if (!apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    const data = await igDownload(url);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      id: data.id,
      shortCode: data.shortCode,
      caption: data.caption,
      result: data.url
    });
  } catch (err) {
    res.json(loghandler.error);
  }
});

// Facebook download route
router.get('/download/fb', async (req, res, next) => {
  const Apikey = req.query.apikey;
  const url = req.query.url;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
  if (!url) return res.json({ status: false, creator: `${creator}`, message: "Please provide the URL" });

  try {
    const data = await FB(url);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      title: data.title,
      desc: data.deskripsi,
      durasi: data.durasi,
      thumb: data.thumbnail,
      result: data.hd
    });
  } catch (err) {
    res.json(loghandler.error);
  }
});

// TikTok stalk route
router.get('/stalk/tiktok', async (req, res, next) => {
  const Apikey = req.query.apikey;
  const username = req.query.username;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
  if (!username) return res.json(loghandler.notusername);

  try {
    const user = await fg.ttStalk(username);
    res.json({
      status: true,
      creator: creator,
      result: {
        name: user.name,
        username: user.username,
        followers: user.followers,
        following: user.following,
        desc: user.desc,
        link: `https://tiktok.com/@${user.username}`,
      }
    });
  } catch (e) {
    res.json({
      status: false,
      creator: creator,
      message: "Error, username might be invalid"
    });
  }
});

// Instagram Stalking Route
router.get('/stalk/ig', async (req, res, next) => {
  const username = req.query.username;
  const apikey = req.query.apikey;

  if (!username) return res.json(loghandler.notusername);
  if (!apikey) return res.json(loghandler.notparam);
  
  if (listkey.includes(apikey)) {
    try {
      const result = await igStalk(username);
      res.json({
        status: true,
        code: 200,
        creator: `${creator}`,
        result
      });
    } catch (err) {
      res.json({
        status: false,
        creator: `${creator}`,
        message: "Error fetching Instagram user data"
      });
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// NPM Package Info Route
router.get('/stalk/npm', async (req, res, next) => {
  const Apikey = req.query.apikey;
  const query = req.query.query;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!query) return res.json({ status: false, creator: `${creator}`, message: "Please provide a package name (query)" });

  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI(`https://registry.npmjs.org/${query}`));
      const data = await response.json();
      
      res.json({
        status: true,
        creator: `${creator}`,
        result: data
      });
    } catch (e) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Random Quotes Route
router.get('/random/quotes', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);

  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://python-api-zhirrr.herokuapp.com/api/random/quotes'));
      const data = await response.json();
      res.json({
        creator: `${creator}`,
        result: data
      });
    } catch (e) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Jadwal Bioskop (Cinema Schedule) Route
router.get('/jadwal-bioskop', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);

  if (listkey.includes(Apikey)) {
    try {
      const { default: Axios } = require('axios');
      const cheerio = require('cheerio');

      const { data } = await Axios.get('https://jadwalnonton.com/now-playing');
      const $ = cheerio.load(data);

      let title = [];
      let url = [];
      let img = [];

      $('div.row > div.item > div.clearfix > div.rowl > div.col-xs-6 > a').each((i, el) => {
        url.push($(el).attr('href'));
      });
      
      $('div.row > div.item > div.clearfix > div.rowl > div.col-xs-6 > a > img').each((i, el) => {
        title.push($(el).attr('alt'));
        img.push($(el).attr('src'));
      });

      let result = title.map((item, i) => ({
        url: url[i],
        title: item,
        img: img[i]
      }));

      res.json({
        creator: `${creator}`,
        status: true,
        result: result
      });
    } catch (error) {
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Shorten URL using TinyURL
router.get('/short/tinyurl', async (req, res, next) => {
  const Apikey = req.query.apikey;
  const url = req.query.url;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
  if (!url) return res.json(loghandler.noturl);

  request(`https://tinyurl.com/api-create.php?url=${url}`, function (error, response, body) {
    if (error) {
      console.log('Error:', color(error, 'red'));
      return res.json(loghandler.invalidlink);
    }

    try {
      res.json({
        status: true,
        creator: `${creator}`,
        result: body
      });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.invalidlink);
    }
  });
});

// Base encoding/decoding (Base64/Base32)
router.get('/base', async (req, res, next) => {
  const { type, encode, decode, apikey } = req.query;

  if (!apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  if (!type) {
    return res.json({
      status: false,
      creator,
      code: 404,
      message: 'Please provide the type parameter. Available types: base64, base32'
    });
  }

  try {
    if (type === 'base64') {
      if (encode) {
        const result = await Base('b64enc', encode);
        return res.json({
          status: true,
          creator: `${creator}`,
          result
        });
      }
      if (decode) {
        const result = await Base('b64dec', decode);
        return res.json({
          status: true,
          creator: `${creator}`,
          result
        });
      }
    } else if (type === 'base32') {
      if (encode) {
        const result = await Base('b32enc', encode);
        return res.json({
          status: true,
          creator: `${creator}`,
          result
        });
      }
      if (decode) {
        const result = await Base('b32dec', decode);
        return res.json({
          status: true,
          creator: `${creator}`,
          result
        });
      }
    } else {
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "Invalid type. Available types: base64, base32."
      });
    }

    if (!(encode || decode)) {
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "Please provide either 'encode' or 'decode' parameter."
      });
    }
  } catch (e) {
    console.log('Error:', color(e, 'red'));
    res.json(loghandler.error);
  }
});

// WP User Information
router.get('/tools/wpuser', async (req, res, next) => {
  const link = req.query.url;
  const apikey = req.query.apikey;

  if (!link) return res.json(loghandler.noturl);
  if (!apikey) return res.json(loghandler.notparam);

  if (listkey.includes(apikey)) {
    try {
      const data = await WPUser(link);
      res.json(data);
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Weather Information (Cuaca)
router.get('/info/cuaca', async (req, res, next) => {
  const apikey = req.query.apikey;
  const kota = req.query.kota;

  if (!apikey) return res.json(loghandler.notparam);
  if (!kota) return res.json({ status: false, code: 406, message: 'Please provide the city (kota) parameter.' });

  if (listkey.includes(apikey)) {
    try {
      const data = await Cuaca(kota);
      res.json(data);
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Earthquake Information (Gempa)
router.get('/info/gempa', async (req, res, next) => {
  const apikey = req.query.apikey;

  if (!apikey) return res.json(loghandler.notparam);

  if (listkey.includes(apikey)) {
    try {
      const result = await Gempa();
      res.json({
        creator: creator,
        result
      });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Story of the Prophets
router.get('/muslim/kisahnabi', async (req, res, next) => {
  const nabi = req.query.nabi;
  const apikey = req.query.apikey;

  if (!apikey) return res.json(loghandler.notparam);
  if (listkey.includes(apikey)) {
    try {
      const result = await Searchnabi(nabi);
      res.json({
        creator: creator,
        result
      });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Hadith retrieval
router.get('/muslim/hadits', async (req, res, next) => {
  const apikey = req.query.apikey;
  const kitab = req.query.kitab;
  const nomor = req.query.nomor;

  if (!apikey) return res.json(loghandler.notparam);
  if (listkey.includes(apikey)) {
    if (!kitab) return res.json({ status: false, creator: creator, message: "Please provide the 'kitab' parameter." });
    if (!nomor) return res.json({ status: false, creator: creator, message: "Please provide the 'nomor' parameter." });

    try {
      const response = await fetch(encodeURI(`https://hadits-api-zhirrr.vercel.app/books/${kitab}/${nomor}`));
      const data = await response.json();
      res.json(data);
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Quranic verse retrieval
router.get('/muslim/quran', async (req, res, next) => {
  const apikey = req.query.apikey;
  const surah = req.query.surah;
  const ayat = req.query.ayat;

  if (!apikey) return res.json(loghandler.notparam);
  if (listkey.includes(apikey)) {
    if (!surah) return res.json({ status: false, creator: creator, message: "Please provide the 'surah' parameter." });
    if (!ayat) return res.json({ status: false, creator: creator, message: "Please provide the 'ayat' parameter." });

    try {
      const response = await fetch(encodeURI(`https://alquran-apiii.vercel.app/surah/${surah}/${ayat}`));
      const data = await response.json();
      res.json({
        result: data
      });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Tahlil Data
router.get('/muslim/tahlil', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/dataTahlil.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Wirid Data
router.get('/muslim/wirid', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/dataWirid.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Ayat Kursi Data
router.get('/muslim/ayatkursi', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/dataAyatKursi.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Daily Prayers Data
router.get('/muslim/doaharian', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/dataDoaHarian.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Bacaan Shalat Data
router.get('/muslim/bacaanshalat', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/dataBacaanShalat.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Niat Shalat Data
router.get('/muslim/niatshalat', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/dataNiatShalat.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Kisah Nabi Data
router.get('/muslim/kisahnabi', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/dataKisahNabi.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Asmaul Husna Data
router.get('/muslim/asmaulhusna', async (req, res, next) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      // Ensure the file path is correct
      const asmaul = JSON.parse(fs.readFileSync(__path + '/data/AsmaulHusna.json'));
      res.json(asmaul);
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Niat Shubuh
router.get('/muslim/niatshubuh', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/NiatShubuh.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Niat Dzuhur
router.get('/muslim/niatdzuhur', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/NiatDzuhur.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Niat Maghrib
router.get('/muslim/niatmaghrib', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/NiatMaghrib.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Niat Isya
router.get('/muslim/niatisya', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/NiatIsya.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Niat Ashar Route
router.get('/muslim/niatashar', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const response = await fetch(encodeURI('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/data/NiatAshar.json'));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Jadwal Shalat Route
router.get('/muslim/jadwalshalat', async (req, res) => {
  const Apikey = req.query.apikey;
  const kota = req.query.kota;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    if (!kota) return res.json({ status: false, creator: `${creator}`, message: "masukan parameter kota" });

    try {
      const response = await fetch(encodeURI(`https://raw.githubusercontent.com/Zhirrr/Zhirrr-Database/main/adzan/${kota}/2021/03.json`));
      const data = await response.json();
      res.json({ result: data });
    } catch (e) {
      console.log('Error:', color(e, 'red'));
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});


// Search Image Route
router.get('/search/image', async (req, res) => {
  const apikey = req.query.apikey;
  const query = req.query.query;

  if (!query) return res.json(loghandler.notquery);
  if (!apikey) return res.json(loghandler.notparam);

  if (listkey.includes(apikey)) {
    try {
      const options = {
        url: `http://results.dogpile.com/serp?qc=images&q=${query}`,
        method: "GET",
        headers: {
          "Accept": "text/html",
          "User-Agent": "Chrome",
        },
      };

      request(options, (error, response, body) => {
        if (error) {
          console.log('Request error:', error);
          return res.json(loghandler.error);
        }

        const $ = cheerio.load(body);
        const links = $(".image a.link");
        const imageLinks = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

        if (!imageLinks.length) {
          return res.json({
            status: false,
            message: "No images found for the query.",
          });
        }

        const randomImageLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];
        res.json({
          status: true,
          code: 200,
          creator: `${creator}`,
          result: randomImageLink,
        });
      });
    } catch (e) {
      console.log('Error:', e);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Wallpaper CyberSpace Route
router.get('/wallpaper/cyberspace', async (req, res) => {
  const apikey = req.query.apikey;

  if (!apikey) return res.json(loghandler.notparam);
  if (listkey.includes(apikey)) {
    try {
      const cyberspaceData = JSON.parse(fs.readFileSync(__path + '/data/CyberSpace.json'));
      const randomCyberSpace = cyberspaceData[Math.floor(Math.random() * cyberspaceData.length)];

      const data = await fetch(randomCyberSpace).then((v) => v.buffer());
      await fs.writeFileSync(__path + '/tmp/CyberSpace.jpeg', data);
      res.sendFile(__path + '/tmp/CyberSpace.jpeg');
    } catch (e) {
      console.log('Error:', e);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Wallpaper Teknologi Route
router.get('/wallpaper/teknologi', async (req, res) => {
  const apikey = req.query.apikey;

  if (!apikey) return res.json(loghandler.notparam);
  if (listkey.includes(apikey)) {
    try {
      const technologyData = JSON.parse(fs.readFileSync(__path + '/data/Technology.json'));
      const randomTechWallpaper = technologyData[Math.floor(Math.random() * technologyData.length)];

      const data = await fetch(randomTechWallpaper).then((v) => v.buffer());
      await fs.writeFileSync(__path + '/tmp/techno.jpeg', data);
      res.sendFile(__path + '/tmp/techno.jpeg');
    } catch (e) {
      console.log('Error:', e);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Wallpaper Muslim Route
router.get('/wallpaper/muslim', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const MuslimWallpapers = JSON.parse(fs.readFileSync(__path + '/data/Islamic.json'));
      const randMuslim = MuslimWallpapers[Math.floor(Math.random() * MuslimWallpapers.length)];

      const data = await fetch(randMuslim).then((v) => v.buffer());
      await fs.writeFileSync(__path + '/tmp/muslim.jpeg', data);

      res.sendFile(__path + '/tmp/muslim.jpeg');
    } catch (error) {
      console.log('Error fetching Muslim wallpaper:', error);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Wallpaper Programming Route
router.get('/wallpaper/programming', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const ProgrammingWallpapers = JSON.parse(fs.readFileSync(__path + '/data/Programming.json'));
      const randProgramming = ProgrammingWallpapers[Math.floor(Math.random() * ProgrammingWallpapers.length)];

      const data = await fetch(randProgramming).then((v) => v.buffer());
      await fs.writeFileSync(__path + '/tmp/Programming.jpeg', data);

      res.sendFile(__path + '/tmp/Programming.jpeg');
    } catch (error) {
      console.log('Error fetching Programming wallpaper:', error);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Wallpaper Pegunungan Route
router.get('/wallpaper/pegunungan', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (listkey.includes(Apikey)) {
    try {
      const MountainWallpapers = JSON.parse(fs.readFileSync(__path + '/data/Mountain.json'));
      const randMountain = MountainWallpapers[Math.floor(Math.random() * MountainWallpapers.length)];

      const data = await fetch(randMountain).then((v) => v.buffer());
      await fs.writeFileSync(__path + '/tmp/Mountain.jpeg', data);

      res.sendFile(__path + '/tmp/Mountain.jpeg');
    } catch (error) {
      console.log('Error fetching Mountain wallpaper:', error);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Random Muslim Quote Route
router.get('/random/quotes/muslim', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

  try {
    const response = await fetch(encodeURI(`https://docs-api-zahirrr.herokuapp.com/api/quote?type=agamis`));
    const data = await response.json();
    res.json({ result: data });
  } catch (error) {
    console.log('Error fetching Muslim quote:', error);
    res.json(loghandler.error);
  }
});

// Random Asmaul Husna Route
router.get('/random/asmaulhusna', async (req, res) => {
  const Apikey = req.query.apikey;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

  try {
    const response = await fetch(encodeURI(`https://python-api-zhirrr.herokuapp.com/api/random/asmaulhusna`));
    const data = await response.json();
    res.json({ result: data });
  } catch (error) {
    console.log('Error fetching Asmaul Husna:', error);
    res.json(loghandler.error);
  }
});

// Wikipedia Info Route
router.get('/info/wikipedia', async (req, res) => {
  const Apikey = req.query.apikey;
  const search = req.query.search;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
  if (!search) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter search" });

  try {
    const response = await fetch(encodeURI(`https://docs-api-zahirrr.herokuapp.com/api/wiki?keyword=${search}`));
    const data = await response.json();
    res.json({ result: data });
  } catch (error) {
    console.log('Error fetching Wikipedia info:', error);
    res.json(loghandler.error);
  }
});

// Info Drakorasia Route
router.get('/info/drakorasia', async (req, res) => {
  const Apikey = req.query.apikey;
  const search = req.query.search;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
  if (!search) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter search" });

  try {
    const response = await fetch(encodeURI(`http://docs-api-zahirrr.herokuapp.com/api/drakorasia?search=${search}`));
    const data = await response.json();
    res.json({ result: data });
  } catch (error) {
    console.error('Error fetching Drakorasia info:', error);
    res.json(loghandler.error);
  }
});

// Fake Data Route
router.get('/fakedata', async (req, res) => {
  const Apikey = req.query.apikey;
  const country = req.query.country;

  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
  if (!country) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter country" });

  try {
    const response = await fetch(encodeURI(`https://fakename-api-zhirrr.vercel.app/api/fakename?country=${country}`));
    const data = await response.json();
    res.json({ result: data });
  } catch (error) {
    console.error('Error fetching fake data:', error);
    res.json(loghandler.error);
  }
});


// Route to get 'Hilih' transformation of a word
router.get('/hilih', async (req, res) => {
    const Apikey = req.query.apikey;
    const kata = req.query.kata;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!kata) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter kata" });

    try {
        const response = await fetch(encodeURI(`https://hilih-api-zhirrr.vercel.app/api/hilih?kata=${kata}`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching Hilih:', e);
        res.json(loghandler.error);
    }
});

// Route to get lyrics of a song
router.get('/music/liriklagu', async (req, res) => {
    const Apikey = req.query.apikey;
    const lagu = req.query.query;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!lagu) return res.json(loghandler.notquery);

    try {
        const lirik = await Lirik(lagu);
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: lirik.data
        });
    } catch (e) {
        console.error('Error fetching lyrics:', e);
        res.json(loghandler.error);
    }
});

// Route to get chords of a song
router.get('/music/chordlagu', async (req, res) => {
    const Apikey = req.query.apikey;
    const lagu = req.query.lagu;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!lagu) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter lagu" });

    try {
        const response = await fetch(encodeURI(`https://python-api-zhirrr.herokuapp.com/api/chord?q=${lagu}`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching chord:', e);
        res.json(loghandler.error);
    }
});

// Route to get KBBI (Indonesian Dictionary) information
router.get('/info/kbbi', async (req, res) => {
    const Apikey = req.query.apikey;
    const kata = req.query.kata;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!kata) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter kata" });

    try {
        const response = await fetch(encodeURI(`https://kbbi-api-zhirrr.vercel.app/api/kbbi?text=${kata}`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching KBBI data:', e);
        res.json(loghandler.error);
    }
});

// Route to get COVID-19 data for Indonesia
router.get('/info/covidindo', async (req, res) => {
    const Apikey = req.query.apikey;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

    try {
        const response = await fetch(encodeURI(`https://covid19-api-zhirrr.vercel.app/api/covid-indonesia`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching COVID-19 data for Indonesia:', e);
        res.json(loghandler.error);
    }
});

// Route to get global COVID-19 data
router.get('/info/covidworld', async (req, res) => {
    const Apikey = req.query.apikey;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

    try {
        const response = await fetch(encodeURI(`https://covid19-api-zhirrr.vercel.app/api/world`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching global COVID-19 data:', e);
        res.json(loghandler.error);
    }
});

// Route to get a random meme
router.get('/random/meme', async (req, res) => {
    const Apikey = req.query.apikey;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

    try {
        const response = await fetch(encodeURI(`https://docs-api-zahirrr.herokuapp.com/api/meme`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching meme:', e);
        res.json(loghandler.error);
    }
});

// Route to get postal code (kodepos) for a city
router.get('/info/kodepos', async (req, res) => {
    const Apikey = req.query.apikey;
    const kota = req.query.kota;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!kota) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter kota" });

    try {
        const response = await fetch(encodeURI(`https://kodepos-api-zhirrr.vercel.app/?q=${kota}`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching postal code data:', e);
        res.json(loghandler.error);
    }
});

// Route to translate text
router.get('/translate', async (req, res) => {
    const Apikey = req.query.apikey;
    const kata = req.query.kata;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!kata) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter kata" });

    try {
        const response = await fetch(encodeURI(`https://docs-api-zahirrr.herokuapp.com/api/translate?text=${kata}`));
        const data = await response.json();
        res.json({
            status: true,
            code: 200,
            creator: `${creator}`,
            result: data
        });
    } catch (e) {
        console.error('Error fetching translation:', e);
        res.json(loghandler.error);
    }
});

// Route to search Kusonime anime
router.get('/anime/kusonime', async (req, res) => {
    const Apikey = req.query.apikey;
    const search = req.query.search;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!search) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter search" });

    try {
        const response = await fetch(encodeURI(`https://docs-api-zahirrr.herokuapp.com/api/kusonime?search=${search}`));
        const data = await response.json();
        res.json({
            result: data
        });
    } catch (e) {
        console.error('Error fetching Kusonime data:', e);
        res.json(loghandler.error);
    }
});

// Route to get random Loli image
router.get('/anime/loli', async (req, res) => {
    const apikey = req.query.apikey;

    if (!apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

    try {
        const options = {
            url: "http://results.dogpile.com/serp?qc=images&q=Loli",
            method: "GET",
            headers: {
                "Accept": "text/html",
                "User-Agent": "Chrome"
            }
        };

        request(options, (error, response, responseBody) => {
            if (error) return res.json(loghandler.error);

            const $ = cheerio.load(responseBody);
            const links = $(".image a.link");
            const results = links.map((i, el) => $(el).attr("href")).get();

            if (!results.length) return res.json({ status: false, message: "No results found" });

            const randomResult = results[Math.floor(Math.random() * results.length)];
            res.json({
                status: true,
                code: 200,
                creator: `${creator}`,
                result: randomResult
            });
        });
    } catch (e) {
        console.error('Error fetching Loli image:', e);
        res.json(loghandler.error);
    }
});

// Route to search Manga
router.get('/anime/manga', async (req, res) => {
    const Apikey = req.query.apikey;
    const search = req.query.search;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);
    if (!search) return res.json({ status: false, creator: `${creator}`, message: "Masukkan parameter search" });

    try {
        const response = await fetch(encodeURI(`https://docs-api-zahirrr.herokuapp.com/api/manga?keyword=${search}`));
        const data = await response.json();
        res.json({
            result: data
        });
    } catch (e) {
        console.error('Error fetching Manga data:', e);
        res.json(loghandler.error);
    }
});
// Route to get Caklontong quiz questions
router.get('/kuis/caklontong', async (req, res) => {
    const Apikey = req.query.apikey;

    if (!Apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

    try {
        const response = await fetch(encodeURI('https://docs-api-zahirrr.herokuapp.com/api/quote?type=caklontong'));
        const data = await response.json();
        res.json({
            result: data
        });
    } catch (e) {
        console.error('Error fetching Caklontong data:', e);
        res.json(loghandler.error);
    }
});

// Route to get Tebak Gambar quiz questions
router.get('/kuis/tebakGambar', async (req, res) => {
    const apikey = req.query.apikey;

    if (!apikey) return res.json(loghandler.notparam);
    if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

    try {
        const result = await tebakGambar();  // Assuming `tebakGambar` is a function that returns the image, answer, and clue
        
        if (result) {
            const hasil = {
                status: true,
                code: 200,
                creator: `${creator}`,
                image: result.img,
                jawaban: result.jawaban,
                clue: result.petunjuk
            };
            return res.json(hasil);
        } else {
            return res.status(408).json({
                status: 408,
                error: 'Error fetching Tebak Gambar data'
            });
        }
    } catch (e) {
        console.error('Error fetching Tebak Gambar data:', e);
        res.status(500).json({
            status: 500,
            error: 'Internal Server Error'
        });
    }
});


/**
* @Maker
**/

// Route to apply shadow effect on text
router.get("/photooxy/shadow", async (req, res) => {
  const text1 = req.query.text;
  const apikey = req.query.apikey;

  // Check for required parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Validate API key
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply shadow effect using the pShadow function
    const data = await pShadow(text1);
    const result = {
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    };
    res.json(result);
  } catch (error) {
    console.error("Error in /photooxy/shadow:", error);
    res.json(loghandler.error); // Send a generic error response
  }
});

// Route to apply romantic effect on text
router.get("/photooxy/romantic", async (req, res) => {
  const text1 = req.query.text;
  const apikey = req.query.apikey;

  // Check for required parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Validate API key
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply romantic effect using the pRomantic function
    const data = await pRomantic(text1);
    const result = {
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    };
    res.json(result);
  } catch (error) {
    console.error("Error in /photooxy/romantic:", error);
    res.json(loghandler.error); // Send a generic error response
  }
});

// @PHOTOOXY
// Route to apply smoke effect on text
router.get("/photooxy/smoke", async (req, res) => {
  const text1 = req.query.text;
  const apikey = req.query.apikey;

  // Check for required parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Validate API key
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply smoke effect using the pSmoke function
    const data = await pSmoke(text1);
    const result = {
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    };
    res.json(result);
  } catch (error) {
    console.error("Error in /photooxy/smoke:", error);
    res.json(loghandler.error); // Send a generic error response
  }
});

// Route to apply burn paper effect on text
router.get("/photooxy/burn-papper", async (req, res) => {
  const text1 = req.query.text;
  const apikey = req.query.apikey;

  // Check for required parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Validate API key
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply burn paper effect using the pBurnPapper function
    const data = await pBurnPapper(text1);
    const result = {
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    };
    res.json(result);
  } catch (error) {
    console.error("Error in /photooxy/burn-papper:", error);
    res.json(loghandler.error); // Send a generic error response
  }
});

// Route for Naruto effect on text
router.get("/photooxy/naruto", async (req, res) => {
  const text1 = req.query.text;
  const apikey = req.query.apikey;

  // Validate input parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);
  
  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Naruto effect using the pNaruto function
    const data = await pNaruto(text1);
    const result = {
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    };
    res.json(result);
  } catch (error) {
    console.error("Error in /photooxy/naruto:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Love Message effect on text
router.get("/photooxy/love-message", async (req, res) => {
  const text1 = req.query.text;
  const apikey = req.query.apikey;

  // Validate input parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Love Message effect using the pLoveMsg function
    const data = await pLoveMsg(text1);
    const result = {
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    };
    res.json(result);
  } catch (error) {
    console.error("Error in /photooxy/love-message:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Message under Grass effect on text
router.get("/photooxy/message-under-grass", async (req, res) => {
  const text1 = req.query.text;
  const apikey = req.query.apikey;

  // Validate input parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Message under Grass effect using the pMsgGrass function
    const data = await pMsgGrass(text1);
    const result = {
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    };
    res.json(result);
  } catch (error) {
    console.error("Error in /photooxy/message-under-grass:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Glitch effect on text
router.get("/photooxy/glitch", async (req, res) => {
  const { text1, text2, apikey } = req.query;

  // Validate input parameters
  if (!text1) return res.json(loghandler.nottext1);
  if (!text2) return res.json(loghandler.nottext2);
  if (!apikey) return res.json(loghandler.notparam);
  
  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Glitch effect using the pGlitch function
    const data = await pGlitch(text1, text2);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    });
  } catch (error) {
    console.error("Error in /photooxy/glitch:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Double Heart effect on text
router.get("/photooxy/double-heart", async (req, res) => {
  const { text, apikey } = req.query;

  // Validate input parameters
  if (!text) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Double Heart effect using the pDoubleHeart function
    const data = await pDoubleHeart(text);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    });
  } catch (error) {
    console.error("Error in /photooxy/double-heart:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Coffee Cup effect on text
router.get("/photooxy/coffe-cup", async (req, res) => {
  const { text, apikey } = req.query;

  // Validate input parameters
  if (!text) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Coffee Cup effect using the pCoffeCup function
    const data = await pCoffeCup(text);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    });
  } catch (error) {
    console.error("Error in /photooxy/coffe-cup:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});
// Route for Love Text effect
router.get("/photooxy/love-text", async (req, res) => {
  const { text, apikey } = req.query;

  // Validate input parameters
  if (!text) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Love Text effect using the pLoveText function
    const data = await pLoveText(text);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    });
  } catch (error) {
    console.error("Error in /photooxy/love-text:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Butterfly effect on text
router.get("/photooxy/butterfly", async (req, res) => {
  const { text, apikey } = req.query;

  // Validate input parameters
  if (!text) return res.json(loghandler.nottext1);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Apply Butterfly effect using the pButterfly function
    const data = await pButterfly(text);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data.url,
    });
  } catch (error) {
    console.error("Error in /photooxy/butterfly:", error);
    res.json(loghandler.error);  // Send a generic error response
  }
});


// Route for Wolf Logo Text Effect
router.get('/textpro/logo-wolf', async (req, res, next) => {
  const { apikey, text, text2 } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);
  if (!text2) return res.json(loghandler.nottext2);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Wolf Logo effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/create-wolf-logo-black-white-937.html", [text, text2]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/logo-wolf:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Natural Leaves Text Effect
router.get('/textpro/natural-leaves', async (req, res, next) => {
  const { apikey, text } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Natural Leaves effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/natural-leaves-text-effect-931.html", [text]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/natural-leaves:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Wolf Logo 2 Text Effect
router.get('/textpro/logo-wolf2', async (req, res, next) => {
  const { apikey, text, text2 } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);
  if (!text2) return res.json(loghandler.nottext2);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Wolf Logo 2 effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/create-wolf-logo-galaxy-online-936.html", [text, text2]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/logo-wolf2:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});


// Route for Thunder Text Effect
router.get('/textpro/thunder', async (req, res, next) => {
  const { apikey, text, text2 } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);
  if (!text2) return res.json(loghandler.nottext2);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Thunder Text effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/thunder-text-effect-online-881.html", [text, text2]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/thunder:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Black Pink Logo Text Effect
router.get('/textpro/black-pink', async (req, res, next) => {
  const { apikey, text } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Black Pink Logo effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", [text]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/black-pink:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Drop Water Text Effect
router.get('/textpro/drop-water', async (req, res, next) => {
  const { apikey, text } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Drop Water text effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/dropwater-text-effect-872.html", [text]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/drop-water:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Christmas Text Effect
router.get('/textpro/christmas', async (req, res, next) => {
  const { apikey, text } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Christmas text effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/create-a-christmas-holiday-snow-text-effect-1007.html", [text]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/christmas:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for 3D Gradient Text Effect
router.get('/textpro/3d-gradient', async (req, res, next) => {
  const { apikey, text } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the 3D Gradient text effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/3d-gradient-text-effect-online-free-1002.html", [text]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/3d-gradient:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});

// Route for Porn Hub Style Text Effect
router.get('/textpro/porn-hub', async (req, res, next) => {
  const { apikey, text1, text2 } = req.query;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text1) return res.json(loghandler.nottext1);
  if (!text2) return res.json(loghandler.nottext2);

  // Check if the API key is valid
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate the Porn Hub Style text effect using zrapi
    const data = await zrapi.textpro("https://textpro.me/pornhub-style-logo-online-generator-free-977.html", [text1, text2]);
    res.json({
      status: true,
      code: 200,
      creator: `${creator}`,
      result: data,
    });
  } catch (err) {
    console.error("Error in /textpro/porn-hub:", err);
    res.json(loghandler.error);  // Send a generic error response
  }
});


/*
@AKHIR TEXTPRO ME
*/

// Route to generate dice roll image
router.get('/maker/dadu', async (req, res, next) => {
  const Apikey = req.query.apikey;

  // Validate the API key
  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

  try {
    // Generate a random number between 1 and 6
    const random = Math.floor(Math.random() * 6) + 1;
    const diceImageUrl = `https://www.random.org/dice/dice${random}.png`;

    // Fetch the dice image
    const data = await fetch(diceImageUrl).then(v => v.buffer());

    // Save the image to the server
    await fs.writeFileSync(__path + '/tmp/dadu.png', data);

    // Send the generated image as a response
    res.sendFile(__path + '/tmp/dadu.png');
  } catch (err) {
    console.error("Error generating dice roll:", err);
    res.json(loghandler.error); // Handle any errors that occur
  }
});

// Route to serve a random video from asupan.json
router.get('/asupan', async (req, res, next) => {
  const Apikey = req.query.apikey;

  // Validate the API key
  if (!Apikey) return res.json(loghandler.notparam);
  if (!listkey.includes(Apikey)) return res.json(loghandler.invalidKey);

  try {
    // Load the asupan data from a JSON file
    const asupan = JSON.parse(fs.readFileSync(__path + '/data/asupan.json'));

    // Select a random asupan video URL
    const Asupan = asupan[Math.floor(Math.random() * asupan.length)];
    const videoUrl = Asupan.asupan;

    // Fetch the video
    const data = await fetch(videoUrl).then(v => v.buffer());

    // Save the video file to the server
    await fs.writeFileSync(__path + '/tmp/asupan.mp4', data);

    // Send the video file as a response
    res.sendFile(__path + '/tmp/asupan.mp4');
  } catch (err) {
    console.error("Error fetching asupan:", err);
    res.json(loghandler.error); // Handle any errors that occur
  }
});

// Route to create a "nulis" (writing) image with custom text
router.get("/maker/nulis", async (req, res, next) => {
  const apikey = req.query.apikey;
  const text = req.query.text;

  // Validate the input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!text) return res.json(loghandler.nottext);
  if (!listkey.includes(apikey)) return res.json(loghandler.invalidKey);

  try {
    // Construct the URL for the nulis API with the provided text
    const nulisUrl = `https://api.zeks.xyz/api/nulis?text=${text}&apikey=apivinz`;

    // Fetch the generated image
    const data = await fetch(nulisUrl).then(v => v.buffer());

    // Save the generated image to the server
    await fs.writeFileSync(__path + '/tmp/nulis.jpeg', data);

    // Send the generated image as a response
    res.sendFile(__path + '/tmp/nulis.jpeg');
  } catch (err) {
    console.error("Error generating nulis image:", err);
    res.json(loghandler.error); // Handle any errors that occur
  }
});

// Route to generate a text-to-image (TTP) sticker
router.get('/maker/ttp', async (req, res, next) => {
  const apikey = req.query.apikey;
  const text = req.query.text;

  // Validate input parameters
  if (!text) return res.json({ status: 404, error: 'Please provide a text parameter' });
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (listkey.includes(apikey)) {
    try {
      // Fetch the TTP sticker image in base64 format
      const data = await fetch(`https://api.areltiyan.site/sticker_maker?text=${encodeURIComponent(text)}`).then(v => v.json());
      const base64 = data.base64;
      
      // Convert base64 to buffer and save the image
      const buffer = base64.slice(22); // Remove the base64 header part
      await fs.writeFileSync(__path + `/tmp/ttp.png`, buffer, 'base64');
      
      // Send the generated image as a response
      res.sendFile(__path + '/tmp/ttp.png');
    } catch (err) {
      console.error("Error generating TTP image:", err);
      res.json({ status: 500, error: "Internal Server Error" });
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Route to generate an animated text-to-image (ATTP) GIF
router.get('/maker/attp', async (req, res, next) => {
  const text = req.query.text;
  const apikey = req.query.apikey;

  // Validate input parameters
  if (!text) return res.json(loghandler.nottext);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (listkey.includes(apikey)) {
    try {
      // Construct the URL for the ATTP GIF generator
      const url = `https://alpin-api-2021.herokuapp.com/api/attp?text=${text}&apikey=alpin1`;
      
      // Fetch the GIF
      const data = await fetch(url).then(v => v.buffer());
      
      // Save the generated GIF to the server
      await fs.writeFileSync(__path + '/tmp/attp.gif', data);
      
      // Send the generated GIF as a response
      res.sendFile(__path + '/tmp/attp.gif');
    } catch (err) {
      console.error("Error generating ATTP GIF:", err);
      res.json({ status: 500, error: "Internal Server Error" });
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Route to generate "Harta Tahta" themed image
router.get('/maker/harta-tahta', async (req, res, next) => {
  const text = req.query.text;
  const apikey = req.query.apikey;

  // Validate input parameters
  if (!text) return res.json(loghandler.nottext);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (listkey.includes(apikey)) {
    try {
      // Construct the URL for the "Harta Tahta" image generator
      const url = `https://api.zeks.xyz/api/hartatahta?text=${text}&apikey=apivinz`;
      
      // Fetch the image
      const data = await fetch(url).then(v => v.buffer());
      
      // Save the generated image to the server
      await fs.writeFileSync(__path + '/tmp/tahta.jpg', data);
      
      // Send the generated image as a response
      res.sendFile(__path + '/tmp/tahta.jpg');
    } catch (err) {
      console.error("Error generating Harta Tahta image:", err);
      res.json({ status: 500, error: "Internal Server Error" });
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Route to generate a sketch effect on an image
router.get('/maker/skatch', async (req, res, next) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  // Validate input parameters
  if (!url) return res.json(loghandler.noturl);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (listkey.includes(apikey)) {
    try {
      const hasil = `https://lindow-api.herokuapp.com/api/sketcheffect?img=${url}&apikey=LindowApi`;
      const data = await fetch(hasil).then(v => v.buffer());

      // Save the image to the server
      await fs.writeFileSync(__path + '/tmp/skatch.jpeg', data);
      
      // Send the generated sketch image as a response
      res.sendFile(__path + '/tmp/skatch.jpeg');
    } catch (err) {
      console.error("Error generating sketch image:", err);
      res.json({ status: 500, error: "Internal Server Error" });
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Route to convert emoji to PNG image
router.get('/maker/emoji2png', async (req, res, next) => {
  const apikey = req.query.apikey;
  const Emoji = req.query.text;

  // Validate input parameters
  if (!apikey) return res.json(loghandler.notparam);
  if (!Emoji) return res.json(loghandler.nottext);

  // Check if the API key is valid
  if (listkey.includes(apikey)) {
    try {
      // Fetch emoji image from emoji API
      const img_emoji = await emoji.get(Emoji);

      // Return the emoji image URL as a response
      res.json({
        status: true,
        code: 200,
        creator: `${creator}`,
        result: img_emoji.images[0].url,
      });
    } catch (err) {
      console.error("Error fetching emoji image:", err);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Route to extract plain text from a website
router.get('/web2plain-text', async (req, res, next) => {
  const apikey = req.query.apikey;
  const url = req.query.url;

  // Validate input parameters
  if (!url) return res.json(loghandler.noturl);
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key is valid
  if (listkey.includes(apikey)) {
    try {
      const response = await fetch(encodeURI(`https://websitetextextraction.apifex.com/api/v1/extract?url=${url}`));
      const data = await response.json();

      // Return the extracted text as a response
      res.json({
        status: true,
        code: 200,
        creator: `${creator}`,
        result: data,
      });
    } catch (err) {
      console.error("Error extracting text from website:", err);
      res.json(loghandler.error);
    }
  } else {
    res.json(loghandler.invalidKey);
  }
});

// Route to check if an API key is active
router.get('/cekapikey', async (req, res, next) => {
  const apikey = req.query.apikey;

  // Validate if API key is provided
  if (!apikey) return res.json(loghandler.notparam);

  // Check if the API key exists in the list
  if (listkey.includes(apikey)) {
    res.json({
      status: 'active',
      creator: `${creator}`,
      apikey: `${apikey}`,
      message: 'APIKEY ACTIVE'
    });
  } else {
    res.json(loghandler.invalidKey);
  }
});

// 404 Error Handler
router.use(function (req, res) {
  res.status(404)
     .set("Content-Type", "text/html")
     .sendFile(__path + '/views/404.html');  // Make sure 404.html exists in the correct path
});

// Export the router module
module.exports = router;


