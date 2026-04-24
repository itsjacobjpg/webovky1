# Instagram API Integration Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Rename `.env.example` to `.env`
2. Get your Instagram Access Token (see instructions below)
3. Add your token to `.env`:
```
INSTAGRAM_ACCESS_TOKEN=your_token_here
```

### 3. Run the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

## 📋 How to Get Instagram Access Token

### Step 1: Create Facebook Developer Account
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Choose "Business" as app type

### Step 2: Add Instagram Graph API
1. In your app dashboard, go to "Products"
2. Click "Set up" next to "Instagram Graph API"
3. Follow the setup wizard

### Step 3: Get User Access Token
1. Go to [Access Token Tool](https://developers.facebook.com/tools/accesstoken/)
2. Select your app
3. Click "Get Token" → "Get User Access Token"
4. Select permissions:
   - `instagram_basic`
   - `pages_read_engagement`
5. Copy the generated token

### Step 4: Exchange for Long-Lived Token (Optional but Recommended)
Use this endpoint to get a 60-day token:
```
GET https://graph.facebook.com/v18.0/oauth/access_token?  
  grant_type=fb_exchange_token&          
  client_id={app-id}&
  client_secret={app-secret}&
  fb_exchange_token={short-lived-token}
```

## 🌐 API Endpoints

### GET /api/instagram
Returns Instagram profile data:
```json
{
  "followers": 1248,
  "posts": 156,
  "profile_pic": "https://..."
}
```

### GET /api/health
Health check endpoint

## 🔧 Frontend Integration

Your existing Instagram preview will automatically:
1. Try to fetch real data from `/api/instagram`
2. Fall back to mock data if server is unavailable
3. Auto-refresh every 5 minutes
4. Cache responses for 5 minutes

## 📁 Project Structure
```
├── server.js          # Node.js server
├── package.json       # Dependencies
├── .env              # Environment variables
└── public/           # Static files (your website)
    └── odkazy.html   # Instagram preview page
```

## ⚠️ Troubleshooting

### Token Expired
- Get a new token from Facebook Developer portal
- Exchange for long-lived token
- Update `.env` file

### API Rate Limits
- Server includes 5-minute caching
- Auto-refresh every 5 minutes
- Returns cached data on API errors

### CORS Issues
- Server runs on same domain as your website
- No CORS issues when deployed together

## 🚀 Deployment

### Option 1: Same Server
Place your website files in `public/` folder and run the Node.js server.

### Option 2: Separate Servers
Update frontend JS to use full URL:
```javascript
const response = await fetch('https://your-server.com/api/instagram');
```

## 📞 Support

If you have issues:
1. Check console for error messages
2. Verify token in `.env` file
3. Test API endpoint directly: `http://localhost:3000/api/instagram`
4. Check Facebook Developer dashboard for app status