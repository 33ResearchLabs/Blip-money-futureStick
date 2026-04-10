const fetch = require('node-fetch');
const path = require('path');

// Load credentials from KV store (lazy - read from db at call time)
function getCredentials(platform) {
  try {
    const db = require('./database');
    return db.kvGet(`publish_creds_${platform}`) || null;
  } catch { return null; }
}

// ── Twitter/X Publishing (API v2 - Free Tier) ──
async function publishTwitter(text, mediaUrl) {
  const creds = getCredentials('twitter');
  if (!creds || !creds.bearer_token) return { ok: false, error: 'Twitter credentials not configured. Set via /api/publish/config' };

  try {
    const body = { text };
    const r = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${creds.bearer_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (data.data && data.data.id) {
      return { ok: true, id: data.data.id, url: `https://x.com/i/web/status/${data.data.id}` };
    }
    return { ok: false, error: data.detail || data.title || JSON.stringify(data) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Instagram Publishing (Meta Graph API) ──
async function publishInstagram(caption, imageUrl) {
  const creds = getCredentials('instagram');
  if (!creds || !creds.access_token || !creds.ig_user_id) return { ok: false, error: 'Instagram credentials not configured' };

  try {
    // Step 1: Create media container
    const createR = await fetch(`https://graph.facebook.com/v19.0/${creds.ig_user_id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: creds.access_token }),
    });
    const container = await createR.json();
    if (!container.id) return { ok: false, error: container.error?.message || 'Failed to create media container' };

    // Step 2: Publish
    const pubR = await fetch(`https://graph.facebook.com/v19.0/${creds.ig_user_id}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: creds.access_token }),
    });
    const pub = await pubR.json();
    if (pub.id) return { ok: true, id: pub.id };
    return { ok: false, error: pub.error?.message || 'Publish failed' };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── YouTube Publishing (Data API v3 - requires OAuth) ──
async function publishYouTube(title, description, videoPath) {
  return { ok: false, error: 'YouTube publishing requires OAuth setup. Coming soon.' };
}

// ── TikTok Publishing (Content Posting API) ──
async function publishTikTok(caption, videoPath) {
  return { ok: false, error: 'TikTok publishing requires OAuth setup. Coming soon.' };
}

// ── LinkedIn Publishing (Share API v2) ──
async function publishLinkedIn(text) {
  const creds = getCredentials('linkedin');
  if (!creds || !creds.access_token || !creds.person_urn) return { ok: false, error: 'LinkedIn credentials not configured' };

  try {
    const body = {
      author: creds.person_urn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    };
    const r = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${creds.access_token}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (data.id) return { ok: true, id: data.id };
    return { ok: false, error: data.message || JSON.stringify(data) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Unified publish function ──
async function publish(platform, content) {
  switch (platform) {
    case 'twitter': return publishTwitter(content.text);
    case 'instagram': return publishInstagram(content.caption, content.image_url);
    case 'youtube': return publishYouTube(content.title, content.description, content.video_path);
    case 'tiktok': return publishTikTok(content.caption, content.video_path);
    case 'linkedin': return publishLinkedIn(content.text);
    default: return { ok: false, error: `Unknown platform: ${platform}` };
  }
}

// ── Get configuration status for all platforms ──
function getStatus() {
  const platforms = ['twitter', 'instagram', 'youtube', 'tiktok', 'linkedin'];
  const status = {};
  for (const p of platforms) {
    const creds = getCredentials(p);
    status[p] = { configured: !!creds, ready: false };
    if (p === 'twitter' && creds?.bearer_token) status[p].ready = true;
    if (p === 'instagram' && creds?.access_token && creds?.ig_user_id) status[p].ready = true;
    if (p === 'linkedin' && creds?.access_token && creds?.person_urn) status[p].ready = true;
  }
  return status;
}

module.exports = { publish, publishTwitter, publishInstagram, publishYouTube, publishTikTok, publishLinkedIn, getStatus, getCredentials };
