# Soham Mali - Personal Portfolio & Resume Website

A sleek, minimal, modern portfolio website built for **Soham Mali (Software Engineer)**. Features a violet accent on dark/light themes, smooth navigation, profile hero card, credentials, interactive project showcase, and a contact form that routes messages directly to your **Telegram** via **AWS Lambda**.

---

## 📁 Project Directory Structure

```text
soham-mali-portfolio/
├── index.html                   # Main portfolio webpage
├── vercel.json                  # Vercel deployment configuration & security headers
├── robots.txt                   # Search engine crawler permissions
├── sitemap.xml                  # SEO search engine sitemap
├── assets/
│   ├── css/
│   │   └── style.css            # Violet accent styling, dark/light themes, responsive layout
│   ├── js/
│   │   ├── config.js            # Single source of truth config (Bio, links, projects, keys)
│   │   └── main.js              # Theme switcher, form submission, analytics events, animations
│   ├── images/
│   │   └── profile.jpg          # Your professional photo
│   └── resume.pdf               # Your official one-page resume
└── lambda/
    └── telegram-handler.js      # Zero-dependency Node.js Lambda function with Function URL
```

---

## 🚀 1. Telegram Bot + AWS Lambda Setup (Contact Form)

This allows visitors to message you directly from your portfolio form, landing instantly on your phone in Telegram—without exposing your Telegram Bot token or phone number!

### Step 1: Create your Telegram Bot with `@BotFather`
1. Open your Telegram app and search for `@BotFather`.
2. Send `/start`, then send `/newbot`.
3. Choose a name (e.g., `Soham Portfolio Bot`) and a username ending in `bot` (e.g., `soham_portfolio_bot`).
4. `@BotFather` will reply with your **Bot Token** (looks like `7123456789:AAFxAbc...`). Copy and save this.

### Step 2: Get your Telegram Chat ID
1. Search for your newly created bot in Telegram and press **Start** (or send `/start`).
2. Search for `@userinfobot` or `@RawDataBot` in Telegram, click Start, and note your `Id` (a number like `123456789`). This is your `TELEGRAM_CHAT_ID`.

### Step 3: Create the AWS Lambda Function
1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. In the top search bar, type **Lambda** and select it.
3. Click **Create function**:
   - Select **Author from scratch**.
   - **Function name**: `portfolio-telegram-dispatcher`
   - **Runtime**: `Node.js 20.x` (or `Node.js 18.x`)
   - **Architecture**: `x86_64` or `arm64`
   - Click **Create function**.
4. In the code editor tab (`index.mjs` or `index.js`), replace the default code with the contents of `lambda/telegram-handler.js`.
5. Click **Deploy**.

### Step 4: Configure Environment Variables in AWS Lambda
1. Inside your Lambda function page, click on the **Configuration** tab -> **Environment variables** (on the left menu).
2. Click **Edit** and add:
   - `TELEGRAM_BOT_TOKEN`: *[Your Bot Token from @BotFather]*
   - `TELEGRAM_CHAT_ID`: *[Your Chat ID]*
   - `ALLOWED_ORIGIN`: `*` (or your Vercel URL once deployed, e.g. `https://soham-mali.vercel.app`)
3. Click **Save**.

### Step 5: Enable Function URL (No API Gateway needed)
1. Still under **Configuration**, click **Function URL** in the left menu.
2. Click **Create Function URL**:
   - **Auth type**: Choose `NONE` (allows public form submission from your website).
   - Under **Configure cross-origin resource sharing (CORS)**:
     - Check **Configure CORS**.
     - **Allow origin**: `*` (or `https://soham-mali.vercel.app`)
     - **Allow methods**: Check `POST` and `OPTIONS`.
     - **Allow headers**: `content-type`.
3. Click **Save**.
4. AWS will give you a **Function URL** (e.g. `https://abc123xyz.lambda-url.us-east-1.on.aws/`).

### Step 6: Connect it to your Portfolio
1. Open `assets/js/config.js`.
2. Find `contactApi`:
   ```javascript
   contactApi: {
     lambdaFunctionUrl: "https://abc123xyz.lambda-url.us-east-1.on.aws/",
     cooldownSeconds: 30
   }
   ```
3. Paste your Function URL and save!

---

## ⚡ 2. Free Hosting Deployment

### Option A: Vercel (Recommended & Easiest)
1. Push this folder to a new repository on your GitHub (`https://github.com/Soham-cpu-coder/portfolio`).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project**, import your `portfolio` repository.
4. Leave settings as default (Framework Preset: *Other*) and click **Deploy**.
5. Your portfolio is live in under 30 seconds with automatic SSL, HTTP/2, global CDN, and automatic continuous deployment every time you `git push`!

### Option B: AWS S3 + CloudFront (100% AWS Free Tier)
If you prefer hosting on AWS infrastructure:
1. **S3 Bucket**:
   - Create a bucket (e.g., `soham-mali-portfolio`).
   - Enable "Static website hosting" in bucket properties.
   - Upload all files from this directory (`index.html`, `assets/`, etc.).
2. **CloudFront CDN (Free HTTPS)**:
   - Create a CloudFront Distribution with your S3 bucket as origin.
   - Set "Viewer protocol policy" to "Redirect HTTP to HTTPS".
   - Set "Default root object" to `index.html`.
   - CloudFront provides 1 TB of outbound data transfer per month for free forever.

---

## 📊 3. Analytics Setup

### Google Analytics 4 (GA4):
1. Go to [analytics.google.com](https://analytics.google.com/) and create a free property named "Portfolio".
2. Select **Web Stream** and enter your website URL.
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`).
4. Replace `G-XXXXXXXXXX` in `index.html` (lines 35 & 40) and `assets/js/config.js`.
5. GA4 will automatically track page views, plus custom events:
   - `resume_download`
   - `contact_submit`
   - `project_click`
   - `social_click`

### Cloudflare Web Analytics (Cookieless & Privacy-First):
1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Analytics & Logs** -> **Web Analytics**.
2. Add your site to get a free Beacon JS token.
3. Uncomment the snippet at the bottom of `<head>` in `index.html` and add your token.

---

## ✏️ 4. How to Update Content Later

All content is cleanly organized in `assets/js/config.js` and `index.html`:
- To change project details or add new ones: Edit the `projects` array in `assets/js/config.js` and the corresponding `<article class="project-card">` in `index.html`.
- To update your resume: Replace `assets/resume.pdf` with your updated PDF.
- To update your profile photo: Replace `assets/images/profile.jpg`.
