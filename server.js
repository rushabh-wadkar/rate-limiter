const path = require('path');
const dotenv = require('dotenv');
const Redis = require("ioredis");
const express = require('express');
const router = require('./src/router/route');

// initializing the config from dotenv
dotenv.config();
const PORT = process.env.PORT || 3000;
const REDIS_CLOUD_ENDPOINT = process.env.REDIS_CLOUD_ENDPOINT;

// initializing the app
const app = express();
const client = new Redis(REDIS_CLOUD_ENDPOINT)

// JSON middleware for requests body
app.use(express.json())

// Middleware for IP address fetching
const GetIPAddress = (req, res, next) => {
    let ip = '';
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(',').pop();
    } else {
        ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    }
    req.loggedip = ip;
    next();
};

// Middleware to rate limit
const RateLimiter = async (req, res, next) => {
    
    const ip = req.loggedip;
    const timer = req.query.timer || 60;

    const reqs = await client.incr(req.loggedip);

    if (reqs === 1) {
        await client.expire(ip, timer);
    } else {
        if (reqs > timer * 2) {
            return res.json({
                status: 'rate-limited'
            }) 
        }
    }
    next();
};

app.use(express.static(path.join(__dirname, 'public')))

app.use("/", router)

app.get("/api/user", GetIPAddress, RateLimiter, (req, res, next) => {
    return res.json({
        status: 'ok'
    })
});


// Connecting to redis db server
client.connect(() => {
    // Spinning up the server
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port: ${PORT}`)
    });
})