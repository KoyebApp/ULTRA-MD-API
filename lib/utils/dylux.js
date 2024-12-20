const fg = require('api-dylux');

// TikTok Stalk Function (uses username)
async function TikTokStalk(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Username of a TikTok user';
  }

  try {
    let data = await fg.ttStalk(query[0]); // Using ttStalk function for TikTok Stalk (with username)
    let txt = `
┌──「 *TIKTOK STALK* 
▢ *🔖Name:* ${data.name}
▢ *🔖Username:* ${data.username}
▢ *👥Followers:* ${data.followers}
▢ *🫂Following:* ${data.following}
▢ *📌Desc:* ${data.desc}

▢ *🔗 Link* : https://tiktok.com/@${data.username}
└────────────`;
    res.send(txt);  // Send the response back to the user
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
    let data = await fg.tiktok2(query[0]);  // Using tiktok2 function for downloading TikTok video
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
    let data = await fg.yta(query[0]);  // Using yta (YouTube to MP3)
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
    let data = await fg.ytv(query[0]);  // Using ytv (YouTube to MP4)
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching YouTube MP4: ${error.message}`;
  }
}

// SoundCloud Download Function (uses URL)
async function SoundCloud(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the SoundCloud track URL';
  }

  try {
    let data = await fg.soundcloudDl(query[0]);  // Using soundcloudDl (Download SoundCloud track)
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching SoundCloud track: ${error.message}`;
  }
}

// SoundCloud2 Download Function (uses URL)
async function SoundCloud2(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the SoundCloud track URL';
  }

  try {
    let data = await fg.soundcloudDl2(query[0]);  // Using soundcloudDl2 (Download SoundCloud track)
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
    let data = await fg.pinterest(query[0]);  // Using pinterest (Search Pinterest)
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
    let data = await fg.wallpaper(query[0]);  // Using wallpaper (Search Wallpapers)
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
    let data = await fg.StickerSearch(query[0]);  // Using StickerSearch (Search Stickers)
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
    let data = await fg.npmSearch(query[0]);  // Using npmSearch (Search npm packages)
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
    let data = await fg.fbdl(query[0]);  // Using fbdl (Download Facebook video)
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
    let data = await fg.twitter(query[0]);  // Using twitter (Download Twitter video)
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching Twitter video: ${error.message}`;
  }
}

// Instagram Story Function (uses username)
async function InstagramStory(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the Instagram username';
  }

  try {
    let data = await fg.igstory(query[0]);  // Using igstory (Instagram Story)
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching Instagram story: ${error.message}`;
  }
}

// TikTok DL2 Function (uses URL for downloading TikTok video)
async function TikTokDownload2(req, res, query) {
  if (!query[0]) {
    throw '✳️ Enter the TikTok video URL';
  }

  try {
    let data = await fg.tiktok2(query[0]);  // Using tiktok2 (TikTok Download)
    res.json({ status: true, result: data });
  } catch (error) {
    throw `Error fetching TikTok video: ${error.message}`;
  }
}

module.exports = {
  TikTokStalk,
  TikTokDownload,
  TikTokDownload2,
  YoutubeMP3,
  YoutubeMP4,
  SoundCloud,
  SoundCloud2,
  PinterestSearch,
  WallpaperSearch,
  StickerSearch,
  NpmSearch,
  FacebookDownload,
  TwitterDownload,
  InstagramStory
};
  
