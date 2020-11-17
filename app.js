require('dotenv').config();
const express = require('express');
const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

const port = process.env.PORT;
const redis_port = process.env.REDIS_PORT;
const base_url_api = 'https://covid19.mathdro.id/api/countries/';

// Create client and connect to redis server
const client = redis.createClient({ host: 'redis', port: redis_port, password: 'rahasiabanget' });

// Get and Set query using Promises
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.setex).bind(client);

const app = express();

const getSummary = async (req, res, next) => {
  try {
    console.log('Fetching Data...');

    // 🚀 Fetching data to covid API
    const { country } = req.params;
    const data = await axios.get(`${base_url_api}${country}`);

    // Set and save data to redis
    await setAsync(`summary_${country}`, 300, JSON.stringify(data.data));

    res.status(200).json({
      status: 'success',
      data: {
        summary: data.data,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

// Cache middleware
const cache = async (req, res, next) => {
  const { country } = req.params;

  try {
    // 🚀 Check if data exists in redis
    const redisData = await getAsync(`summary_${country}`);

    // if data exist send it as response
    if (redisData !== null) {
      res.status(200).json({
        status: 'success',
        data: {
          summary: JSON.parse(redisData),
        },
      });
    } else {
      // if NOT exist go to next operations
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

// Implement cache middleware to route
app.get('/:country', cache, getSummary);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`this app is running on ${port}`);
});
