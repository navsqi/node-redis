require('dotenv').config();
const express = require('express');
const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

const port = process.env.PORT || 3001;
const redis_port = process.env.REDIS_PORT || 6379;

const client = redis.createClient({ host: 'redis', port: redis_port, password: 'rahasiabanget' });

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.setex).bind(client);

const app = express();

const getSummary = async (req, res, next) => {
  try {
    console.log('Fetching Data...');
    const { country } = req.params;
    const data = await axios.get(`https://covid19.mathdro.id/api/countries/${country}`);

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
    const redisData = await getAsync(`summary_${country}`);
    if (redisData !== null) {
      res.status(200).json({
        status: 'success',
        data: {
          summary: JSON.parse(redisData),
        },
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

app.get('/:country', cache, getSummary);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`this app is running on ${port}`);
});
