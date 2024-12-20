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

    re.send(txt); // Send the response back to the user
  } catch (error) {
    throw `Error fetching TikTok data: ${error.message}`;
  }
}

// Instagram Stalker Function
async function InstaStalk(req, re, query) {
  if (!query[0]) {
    throw `✳️ Enter the Instagram Username\n\n📌Example: ${usedPrefix + command} global.techinfo`;
  }

  try {
    let res = await fg.instaStalk(query[0]);  // Assuming fg has instaStalk API
    let te = `
┌──「 *INSTAGRAM STALK* 
▢ *🔖Name:* ${res.name} 
▢ *🔖Username:* ${res.username}
▢ *👥Followers:* ${res.followers}
▢ *🫂Following:* ${res.following}
▢ *📌Bio:* ${res.biography}
▢ *🏝️Posts:* ${res.posts}
▢ *🔗 Link:* https://instagram.com/${res.username.replace(/^@/, '')}
└────────────`;

    re.send(te); // Send the response back to the user
  } catch (error) {
    throw `Error fetching Instagram data: ${error.message}`;
  }
}

module.exports = { TikTokStalk, InstaStalk };
