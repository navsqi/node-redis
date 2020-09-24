require('dotenv').config();
const http = require('http');
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');

const server = http.createServer((req, res) => {
  if (req.url == '/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(`Hello ${process.env.NAME}!`);
  } else if (req.url == '/db') {
    mongoose
      .connect(`mongodb://${process.env.WAIT_HOSTS}/test`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log('Connecting to database...');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('DB Connection SUCCESS!');
      })
      .catch((err) => {
        console.log(err);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('DB Connection ERROR!');
      });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('OK: Server is successfully listening WOIIIIIIzzzzzzzzzz');
  }
});

server.listen(port, () => {
  console.log(`this app is running on ${port}`);
});
