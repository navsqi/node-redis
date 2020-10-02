require('dotenv').config();
const express = require('express');

const port = process.env.PORT || 3001;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`this app is running on ${port}`);
});
