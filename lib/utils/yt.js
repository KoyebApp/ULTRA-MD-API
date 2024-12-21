const ytdl = require("@distube/ytdl-core");
const fs = require("fs");
const yts = require("yt-search");

// Function to read cookies from a file
async function getCookies() {
  try {
    const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf-8"));
    return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");
  } catch (error) {
    throw new Error("Error reading cookies: " + error.message);
  }
}

// Function to create a ytdl agent with cookies
async function createYtdlAgent() {
  const cookieHeader = await getCookies();
  const agent = ytdl.createAgent(undefined, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return agent;
}

// Function to create a proxy agent
function createProxyAgent(proxyUrl) {
  const agent = ytdl.createProxyAgent({ uri: proxyUrl });
  return agent;
}

// Function to create an agent with both cookies and proxy support
async function createAgentWithProxyAndCookies(proxyUrl) {
  const cookieHeader = await getCookies();
  const agent = ytdl.createProxyAgent({ uri: proxyUrl }, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return agent;
}

// Function to download MP3 from a YouTube URL
async function ytDonlodMp3(url, proxyUrl = null) {
  try {
    const id = ytdl.getVideoID(url);
    const agent = proxyUrl ? await createAgentWithProxyAndCookies(proxyUrl) : await createYtdlAgent();
    const data = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`, { agent });
    const formats = data.formats;
    const audio = formats.filter(f => f.mimeType === 'audio/webm; codecs="opus"');
    
    const result = {
      title: data.videoDetails.title,
      thumb: data.videoDetails.thumbnails[0].url,
      channel: data.videoDetails.author,
      published: data.videoDetails.uploadDate,
      views: data.videoDetails.viewCount,
      url: audio[1]?.url, // Use the second audio format (if available)
    };
    return result;
  } catch (error) {
    throw new Error('Error fetching video metadata for MP3: ' + error.message);
  }
}

// Function to download MP4 (video) from a YouTube URL
async function ytDonlodMp4(url, proxyUrl = null) {
  try {
    const id = ytdl.getVideoID(url);
    const agent = proxyUrl ? await createAgentWithProxyAndCookies(proxyUrl) : await createYtdlAgent();
    const data = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`, { agent });
    const formats = data.formats;
    const video = formats.filter(f => f.container === 'mp4' && f.hasVideo && f.hasAudio);
    
    const result = {
      title: data.videoDetails.title,
      thumb: data.videoDetails.thumbnails[0].url,
      channel: data.videoDetails.author,
      published: data.videoDetails.uploadDate,
      views: data.videoDetails.viewCount,
      url: video[0]?.url, // Use the first video format
    };
    return result;
  } catch (error) {
    throw new Error('Error fetching video metadata for MP4: ' + error.message);
  }
}

// Function to search for a video on YouTube and get the first result (audio)
async function ytPlayMp3(query, proxyUrl = null) {
  try {
    const searchResults = await yts(query);
    const videoUrl = searchResults.all.find(video => video.type === 'video')?.url;
    
    if (videoUrl) {
      return await ytDonlodMp3(videoUrl, proxyUrl);
    } else {
      throw new Error('No video found for the query');
    }
  } catch (error) {
    throw new Error('Error searching or fetching video for MP3: ' + error.message);
  }
}

// Function to search for a video on YouTube and get the first result (video)
async function ytPlayMp4(query, proxyUrl = null) {
  try {
    const searchResults = await yts(query);
    const videoUrl = searchResults.all.find(video => video.type === 'video')?.url;
    
    if (videoUrl) {
      return await ytDonlodMp4(videoUrl, proxyUrl);
    } else {
      throw new Error('No video found for the query');
    }
  } catch (error) {
    throw new Error('Error searching or fetching video for MP4: ' + error.message);
  }
}

// Function to perform a search on YouTube
async function ytSearch(query) {
  try {
    const searchResults = await yts(query);
    return searchResults.all; // Returns all search results
  } catch (error) {
    throw new Error('Error searching YouTube: ' + error.message);
  }
}

module.exports = {
  ytDonlodMp3,
  ytDonlodMp4,
  ytPlayMp3,
  ytPlayMp4,
  ytSearch
};
                    
