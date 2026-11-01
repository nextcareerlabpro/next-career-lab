/**
 * UpgradeYourResume.com — Multi-Search Engine Sitemap Pinger & IndexNow Broadcaster
 * 
 * Pings:
 *  1. Google Ping Endpoint
 *  2. Bing & Yandex via IndexNow API protocol
 * 
 * Usage:
 *  node scripts/ping-sitemap.js
 */

const https = require('https');
const http = require('http');

const SITEMAP_URL = 'https://upgradeyourresume.com/sitemap.xml';
const HOST = 'upgradeyourresume.com';

async function pingUrl(targetUrl) {
  return new Promise((resolve) => {
    const client = targetUrl.startsWith('https') ? https : http;
    client.get(targetUrl, (res) => {
      resolve({ url: targetUrl, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ url: targetUrl, statusCode: 500, error: err.message });
    });
  });
}

async function pingGoogle() {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  console.log(`[Google Ping] Pinging: ${url}`);
  const res = await pingUrl(url);
  console.log(`[Google Ping] Response status: ${res.statusCode}`);
}

async function pingBingIndexNow(apiKey = null) {
  if (!apiKey) {
    console.log(`[IndexNow] No INDEXNOW_KEY provided. Skipping IndexNow direct ping.`);
    return;
  }

  const payload = JSON.stringify({
    host: HOST,
    key: apiKey,
    keyLocation: `https://${HOST}/${apiKey}.txt`,
    urlList: [
      `https://${HOST}/`,
      `https://${HOST}/ats-resume-checker`,
      `https://${HOST}/ai-resume-writer`,
      `https://${HOST}/templates`,
      `https://${HOST}/blog`,
      SITEMAP_URL
    ]
  });

  return new Promise((resolve) => {
    const req = https.request('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      console.log(`[IndexNow] Submitted ${HOST} to IndexNow network. Status: ${res.statusCode}`);
      resolve(res.statusCode);
    });

    req.on('error', (e) => {
      console.error(`[IndexNow Error]`, e.message);
      resolve(500);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log(`\x1b[36m==================================================\x1b[0m`);
  console.log(`Triggering Search Engine Ping for ${SITEMAP_URL}`);
  console.log(`\x1b[36m==================================================\x1b[0m\n`);

  await pingGoogle();
  await pingBingIndexNow(process.env.INDEXNOW_KEY);

  console.log(`\n\x1b[32m[DONE]\x1b[0m Search engine notification complete.`);
}

main();
