const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory cache
const cache = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000 // 5 minutes in milliseconds
};

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Instagram API endpoint
app.get('/api/instagram', async (req, res) => {
    try {
        // Check cache first
        const now = Date.now();
        if (cache.data && (now - cache.timestamp) < cache.ttl) {
            console.log('Serving from cache');
            return res.json(cache.data);
        }

        // Get token from environment
        const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
        
        if (!accessToken) {
            return res.status(500).json({
                error: 'Instagram access token not configured',
                message: 'Please set INSTAGRAM_ACCESS_TOKEN in .env file'
            });
        }

        // Call Instagram Graph API
        const response = await axios.get('https://graph.instagram.com/me', {
            params: {
                fields: 'followers_count,media_count,profile_picture_url',
                access_token: accessToken
            },
            timeout: 10000
        });

        // Process data
        const data = {
            followers: response.data.followers_count || 0,
            posts: response.data.media_count || 0,
            profile_pic: response.data.profile_picture_url || null
        };

        // Cache the result
        cache.data = data;
        cache.timestamp = now;

        console.log('Fetched fresh data from Instagram API');
        res.json(data);

    } catch (error) {
        console.error('Instagram API Error:', error.response?.data || error.message);
        
        // Return cached data if available, even if expired
        if (cache.data) {
            console.log('Returning cached data due to API error');
            return res.json(cache.data);
        }

        // Return error response
        res.status(500).json({
            error: 'Failed to fetch Instagram data',
            message: error.response?.data?.error?.message || error.message,
            code: error.response?.data?.error?.code
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Instagram API endpoint: /api/instagram');
});