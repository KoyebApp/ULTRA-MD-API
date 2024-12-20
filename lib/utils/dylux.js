const fg = require('api-dylux');

// TikTok Stalker Function
async function TikTokStalk(req, re, query) {
  if (!query[0]) {
    throw '✳️ Enter the Username of a TikTok user';
  }
  
  try {
    let res = await fg.ttStalk(query[0]);
    let txt = `
┌──「 *TIKTOK STALK* 
▢ *🔖Name:* ${res.name}
▢ *🔖Username:* ${res.username}
▢ *👥Followers:* ${res.followers}
▢ *🫂Following:* ${res.following}
▢ *📌Desc:* ${res.desc}

▢ *🔗 Link* : https://tiktok.com/${res.username}
└────────────`;
    re.send(txt);  // Send the response back to the user
  } catch (error) {
    throw `Error fetching TikTok data: ${error.message}`;
  }
}

// YouTube MP3 Function
async function YoutubeMP3(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the YouTube video URL`;
  }

  try {
    let res = await fg.yta(query[0]);  // Using yta (YouTube to MP3)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching YouTube MP3: ${error.message}`;
  }
}

// YouTube MP4 Function
async function YoutubeMP4(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the YouTube video URL`;
  }

  try {
    let res = await fg.ytv(query[0]);  // Using ytv (YouTube to MP4)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching YouTube MP4: ${error.message}`;
  }
}

// SoundCloud Download Function
async function SoundCloud(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the SoundCloud track URL`;
  }

  try {
    let res = await fg.soundcloudDl(query[0]);  // Using soundcloudDl (Download SoundCloud track)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching SoundCloud track: ${error.message}`;
  }
}

// Pinterest Search Function
async function PinterestSearch(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the Pinterest search term`;
  }

  try {
    let res = await fg.pinterest(query[0]);  // Using pinterest (Search Pinterest)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching Pinterest data: ${error.message}`;
  }
}

// Wallpaper Search Function
async function WallpaperSearch(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the wallpaper search term`;
  }

  try {
    let res = await fg.wallpaper(query[0]);  // Using wallpaper (Search Wallpapers)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching wallpaper: ${error.message}`;
  }
}

// Sticker Search Function
async function StickerSearch(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the sticker search term`;
  }

  try {
    let res = await fg.StickerSearch(query[0]);  // Using StickerSearch (Search Stickers)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching sticker: ${error.message}`;
  }
}

// npm Search Function
async function NpmSearch(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the npm search term`;
  }

  try {
    let res = await fg.npmSearch(query[0]);  // Using npmSearch (Search npm packages)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching npm package: ${error.message}`;
  }
}

// Facebook Download Function
async function FacebookDownload(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the Facebook video URL`;
  }

  try {
    let res = await fg.fbdl(query[0]);  // Using fbdl (Download Facebook video)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching Facebook video: ${error.message}`;
  }
}

// Twitter Download Function
async function TwitterDownload(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the Twitter video URL`;
  }

  try {
    let res = await fg.twitter(query[0]);  // Using twitter (Download Twitter video)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching Twitter video: ${error.message}`;
  }
}

// Instagram Story Function
async function InstagramStory(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the Instagram username`;
  }

  try {
    let res = await fg.igstory(query[0]);  // Using igstory (Instagram Story)
    re.json({ status: true, result: res });
  } catch (error) {
    throw `Error fetching Instagram story: ${error.message}`;
  }
}

module.exports = {
  TikTokStalk, 
  YoutubeMP3, 
  YoutubeMP4, 
  SoundCloud, 
  PinterestSearch, 
  WallpaperSearch, 
  StickerSearch, 
  NpmSearch, 
  FacebookDownload, 
  TwitterDownload, 
  InstagramStory
};
