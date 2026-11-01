# ⚡ Google Indexing API — Complete Fast Setup Guide
> **Target Domain:** `https://upgradeyourresume.com`  
> **Goal:** Get new programmatic pages, blog posts, and landing pages crawled and indexed within 24 hours instead of waiting weeks.

---

## 📋 Prerequisites
1. Access to [Google Search Console](https://search.google.com/search-console) with verified ownership of `upgradeyourresume.com` (or `https://upgradeyourresume.com`).
2. A Google Cloud account (free tier is 100% sufficient; Google provides 200 free indexing requests per day).

---

## 🛠️ Step 1: Create a Google Cloud Project & Enable Indexing API
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named: `UpgradeYourResume-SEO`.
3. In the search bar at the top, search for **"Web Search Indexing API"** (or open [Indexing API Library](https://console.cloud.google.com/apis/library/indexing.googleapis.com)).
4. Click **ENABLE**.

---

## 🔑 Step 2: Create a Service Account & Download JSON Key
1. In Google Cloud Console, navigate to **IAM & Admin** > **Service Accounts** (or [Service Accounts Console](https://console.cloud.google.com/iam-admin/serviceaccounts)).
2. Click **+ CREATE SERVICE ACCOUNT**.
   - **Service account name:** `indexing-bot`
   - **Service account ID:** `indexing-bot@upgradeyourresume-seo.iam.gserviceaccount.com` (auto-generated)
   - Click **CREATE AND CONTINUE**.
3. **Role:** Select `Basic` > `Owner` (or `Editor`).
4. Click **CONTINUE** and then **DONE**.
5. Find your newly created service account in the table, click the **three dots (⋮) under Actions** > **Manage keys**.
6. Click **ADD KEY** > **Create new key**.
7. Select **JSON** format and click **CREATE**.
8. A JSON file will download to your computer.
9. **Rename this downloaded file to `service-account.json`** and place it in the `scripts/` directory:
   ```
   D:\Upgradeyourresume\scripts\service-account.json
   ```
   *(Or set `GOOGLE_SERVICE_ACCOUNT_JSON` environment variable pointing to its path).*

---

## 🛡️ Step 3: Add Service Account as Owner in Google Search Console (CRITICAL)
> ⚠️ **Warning:** If you skip this step, Google Indexing API will return `403 Forbidden: Permission denied`.

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select your property: `https://upgradeyourresume.com` or domain property `upgradeyourresume.com`.
3. In the left sidebar, click **Settings** (⚙️ at the bottom).
4. Click on **Users and permissions**.
5. Click **Add user** (top right button).
6. In **Email address**, paste your Service Account email:
   ```
   indexing-bot@<YOUR-PROJECT-ID>.iam.gserviceaccount.com
   ```
7. In **Permission**, select **Owner** (it *must* be Owner for the Indexing API).
8. Click **Add**.

---

## 🚀 Step 4: Run the Indexing Script

### 1. Test a single URL
```bash
node scripts/google-indexing.js --url https://upgradeyourresume.com/ats-resume-checker
```

### 2. Check the indexing notification status
```bash
node scripts/google-indexing.js --status https://upgradeyourresume.com/ats-resume-checker
```

### 3. Automatically submit all programmatic role pages in batch
```bash
node scripts/google-indexing.js --batch-roles
```

### 4. Submit custom URLs from a text file
```bash
node scripts/google-indexing.js --file ./my-urls.txt
```
