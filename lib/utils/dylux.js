const fg = require('api-dylux');

// Define User-Agent for headers
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// TikTok Stalk Function (uses username)
async function TikTokStalk(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Username of a TikTok user';
  }

  try {
    let data = await fg.ttStalk(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({
      status: true,
      result: {
        name: data.name,
        username: data.username,
        followers: data.followers,
        following: data.following,
        desc: data.desc,
        link: `https://tiktok.com/@${data.username}`
      }
    });
  } catch (error) {
    throw `Error fetching TikTok data: ${error.message}`;
  }
}

// TikTok Download Function (uses URL)
async function TikTokDownload(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the TikTok video URL';
  }

  try {
    let data = await fg.tiktok(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching TikTok video: ${error.message}`;
  }
}

// YouTube MP3 Function (uses URL)
async function YoutubeMP3(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the YouTube video URL';
  }

  try {
    let data = await fg.yta(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching YouTube MP3: ${error.message}`;
  }
}

// YouTube MP4 Function (uses URL)
async function YoutubeMP4(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the YouTube video URL';
  }

  try {
    let data = await fg.ytv(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching YouTube MP4: ${error.message}`;
  }
}

// SoundCloud Download Function (uses URL)
async function SoundCloudDl(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the SoundCloud track URL';
  }

  try {
    let data = await fg.soundcloudDl(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching SoundCloud track: ${error.message}`;
  }
}

// SoundCloud2 Download Function (uses URL)
async function SoundCloudDl2(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the SoundCloud track URL';
  }

  try {
    let data = await fg.soundcloudDl2(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching SoundCloud track: ${error.message}`;
  }
}

// Pinterest Search Function (uses search term)
async function PinterestSearch(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Pinterest search term';
  }

  try {
    let data = await fg.pinterest(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching Pinterest data: ${error.message}`;
  }
}

// Wallpaper Search Function (uses search term)
async function WallpaperSearch(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the wallpaper search term';
  }

  try {
    let data = await fg.wallpaper(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching wallpaper: ${error.message}`;
  }
}

// Sticker Search Function (uses search term)
async function StickerSearch(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the sticker search term';
  }

  try {
    let data = await fg.StickerSearch(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching sticker: ${error.message}`;
  }
}

// npm Search Function (uses search term)
async function NpmSearch(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the npm search term';
  }

  try {
    let data = await fg.npmSearch(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching npm package: ${error.message}`;
  }
}

// Facebook Download Function (uses URL)
async function FacebookDownload(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Facebook video URL';
  }

  try {
    let data = await fg.fbdl(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching Facebook video: ${error.message}`;
  }
}

// Twitter Download Function (uses URL)
async function TwitterDownload(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Twitter video URL';
  }

  try {
    let data = await fg.twitter(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching Twitter video: ${error.message}`;
  }
}

// Instagram Stalk Function (uses username)
async function InstaStalk(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Username of an Instagram user';
  }

  try {
    let data = await fg.igStalk(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({
      status: true,
      result: {
        name: data.name,
        username: data.username,
        followers: data.followers,
        following: data.following,
        desc: data.desc,
        link: `https://instagram.com/@${data.username}`
      }
    });
  } catch (error) {
    throw `Error fetching Instagram data: ${error.message}`;
  }
}

// Instagram Post/Story/Video Function (uses URL)
async function Instagram(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Instagram post URL';
  }

  try {
    let data = await fg.igdl(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching Instagram data: ${error.message}`;
  }
}

// TikTok DL2 Function (uses URL for downloading TikTok video)
async function MediafireDownload(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the TikTok video URL';
  }

  try {
    let data = await fg.mediafireDl(query[0], { headers: { 'User-Agent': userAgent } });
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching TikTok video: ${error.message}`;
  }
}

module.exports = {
  TikTokStalk,
  TikTokDownload,
  MediafireDownload,
  YoutubeMP3,
  YoutubeMP4,
  SoundCloudDl,
  SoundCloudDl2,
  PinterestSearch,
  WallpaperSearch,
  StickerSearch,
  InstaStalk,
  NpmSearch,
  FacebookDownload,
  TwitterDownload,
  Instagram
};
                                     
