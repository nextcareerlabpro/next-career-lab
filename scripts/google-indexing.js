/**
 * UpgradeYourResume.com — Google Indexing API Fast Dispatcher
 * 
 * Purpose: Ping Google Indexing API immediately when new programmatic pages,
 * blog posts, or core tool pages are published to get them crawled within 24 hours.
 * 
 * Supports:
 *  - Single URL notification
 *  - Batch URLs notification from array or file
 *  - Automated JWT OAuth2 token generation using native Node.js crypto (zero-dependency)
 * 
 * Usage:
 *  node scripts/google-indexing.js --url https://upgradeyourresume.com/resume-for/data-analyst
 *  node scripts/google-indexing.js --file ./urls-to-index.txt
 *  node scripts/google-indexing.js --status https://upgradeyourresume.com/resume-for/data-analyst
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Path to Service Account JSON key
const KEY_FILE_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || path.join(__dirname, 'service-account.json');

/**
 * Load service account credentials
 */
function loadCredentials() {
  if (!fs.existsSync(KEY_FILE_PATH)) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Service account key not found at: ${KEY_FILE_PATH}`);
    console.error(`\x1b[33m[SETUP REQUIRED]\x1b[0m Please place your Google Service Account JSON key file at:`);
    console.error(`  -> ${KEY_FILE_PATH}`);
    console.error(`Or set the GOOGLE_SERVICE_ACCOUNT_JSON environment variable.\n`);
    console.error(`Need help? Check docs/GOOGLE_INDEXING_API_SETUP.md for step-by-step instructions.`);
    process.exit(1);
  }

  try {
    const raw = fs.readFileSync(KEY_FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Failed to parse service account JSON file:`, err.message);
    process.exit(1);
  }
}

/**
 * Base64URL encoding helper
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Generate Google OAuth2 Access Token from Service Account private key using native crypto
 */
async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1 hour token

  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const claimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: expiry,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  signer.end();
  const signature = signer.sign(credentials.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  // Request OAuth2 token from Google
  const postData = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error(`OAuth2 error: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Publish URL update or delete notification to Google Indexing API
 * @param {string} accessToken 
 * @param {string} urlTarget 
 * @param {'URL_UPDATED' | 'URL_DELETED'} type 
 */
async function notifyGoogleIndexing(accessToken, urlTarget, type = 'URL_UPDATED') {
  const payload = JSON.stringify({
    url: urlTarget,
    type: type
  });

  return new Promise((resolve, reject) => {
    const req = https.request('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, url: urlTarget, status: res.statusCode, response: parsed });
          } else {
            resolve({ success: false, url: urlTarget, status: res.statusCode, error: parsed });
          }
        } catch (err) {
          resolve({ success: false, url: urlTarget, status: res.statusCode, error: data });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, url: urlTarget, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Query status of an existing URL in Google Indexing API
 */
async function getUrlStatus(accessToken, urlTarget) {
  const encodedUrl = encodeURIComponent(urlTarget);
  return new Promise((resolve, reject) => {
    const req = https.request(`https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodedUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (err) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * CLI Entrypoint
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
\x1b[36mUpgrade Your Resume — Google Indexing API Tool\x1b[0m
==================================================
Usage:
  node scripts/google-indexing.js --url <URL>
  node scripts/google-indexing.js --file <PATH_TO_URLS_TXT>
  node scripts/google-indexing.js --status <URL>
  node scripts/google-indexing.js --batch-roles

Options:
  --url <url>          Publish single URL notification (URL_UPDATED)
  --file <filepath>    Publish all URLs listed in a text file (one URL per line)
  --status <url>       Query Google's last notification status for a URL
  --batch-roles        Automatically notify Google of all 20+ programmatic role pages
    `);
    process.exit(0);
  }

  console.log(`\x1b[34m[INFO]\x1b[0m Initializing Google Indexing API client...`);
  const credentials = loadCredentials();
  console.log(`\x1b[32m[AUTH]\x1b[0m Service account loaded: ${credentials.client_email}`);

  let accessToken;
  try {
    accessToken = await getAccessToken(credentials);
    console.log(`\x1b[32m[AUTH]\x1b[0m OAuth2 token successfully obtained from Google.`);
  } catch (err) {
    console.error(`\x1b[31m[AUTH ERROR]\x1b[0m Failed to authenticate with Google:`, err.message);
    process.exit(1);
  }

  // Handle --status
  const statusIdx = args.indexOf('--status');
  if (statusIdx !== -1 && args[statusIdx + 1]) {
    const targetUrl = args[statusIdx + 1];
    console.log(`\nChecking indexing status for: ${targetUrl}`);
    const result = await getUrlStatus(accessToken, targetUrl);
    console.log(`Status Code: ${result.status}`);
    console.log(`Response:`, JSON.stringify(result.data, null, 2));
    return;
  }

  // Handle --url
  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    const targetUrl = args[urlIdx + 1];
    console.log(`\nNotifying Google Indexing API: ${targetUrl}`);
    const result = await notifyGoogleIndexing(accessToken, targetUrl, 'URL_UPDATED');
    if (result.success) {
      console.log(`\x1b[32m[SUCCESS]\x1b[0m URL successfully sent to Google Indexing Queue!`);
      console.log(`Timestamp:`, result.response?.urlNotificationMetadata?.latestUpdate?.notifyTime || new Date().toISOString());
    } else {
      console.error(`\x1b[31m[FAILED]\x1b[0m Status ${result.status}:`, JSON.stringify(result.error, null, 2));
    }
    return;
  }

  // Handle --file
  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const filePath = path.resolve(args[fileIdx + 1]);
    if (!fs.existsSync(filePath)) {
      console.error(`\x1b[31m[ERROR]\x1b[0m File not found: ${filePath}`);
      process.exit(1);
    }
    const lines = fs.readFileSync(filePath, 'utf-8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && l.startsWith('http'));

    console.log(`\nFound ${lines.length} URLs in ${filePath}. Beginning submission...`);
    await processBatchUrls(accessToken, lines);
    return;
  }

  // Handle --batch-roles
  if (args.includes('--batch-roles')) {
    const rolesDataPath = path.join(__dirname, '../lib/job-roles-data.json');
    let slugs = [];
    if (fs.existsSync(rolesDataPath)) {
      const { JOB_ROLES } = JSON.parse(fs.readFileSync(rolesDataPath, 'utf-8'));
      slugs = JOB_ROLES.map(r => `https://upgradeyourresume.com/resume-for/${r.slug}`);
    } else {
      // Default default programmatic slugs
      slugs = [
        'software-engineer-fresher',
        'data-analyst',
        'product-manager',
        'devops-cloud-engineer',
        'digital-marketing-specialist',
        'full-stack-developer',
        'frontend-react-developer',
        'backend-node-developer',
        'business-analyst',
        'ui-ux-designer',
        'machine-learning-engineer',
        'cybersecurity-analyst',
        'human-resources-recruiter',
        'financial-analyst',
        'sales-account-executive'
      ].map(slug => `https://upgradeyourresume.com/resume-for/${slug}`);
    }

    console.log(`\nSubmitting ${slugs.length} programmatic role URLs to Google Indexing API...`);
    await processBatchUrls(accessToken, slugs);
    return;
  }
}

/**
 * Process a batch of URLs with rate limiting (Google allows ~200 quota requests per day default)
 */
async function processBatchUrls(accessToken, urls) {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    process.stdout.write(`[${i + 1}/${urls.length}] Notifying: ${url} ... `);
    const result = await notifyGoogleIndexing(accessToken, url, 'URL_UPDATED');

    if (result.success) {
      process.stdout.write(`\x1b[32mOK\x1b[0m\n`);
      successCount++;
    } else {
      process.stdout.write(`\x1b[31mFAIL (${result.status})\x1b[0m\n`);
      if (result.error?.error?.message) {
        console.error(`   -> ${result.error.error.message}`);
      }
      failCount++;
    }

    // Gentle delay (500ms) between calls to respect Google API quotas
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n\x1b[36m========================================\x1b[0m`);
  console.log(`Batch submission complete!`);
  console.log(`  Successful: \x1b[32m${successCount}\x1b[0m`);
  console.log(`  Failed:     \x1b[31m${failCount}\x1b[0m`);
  console.log(`\x1b[36m========================================\x1b[0m`);
}

main().catch(err => {
  console.error(`Unhandled error:`, err);
  process.exit(1);
});
