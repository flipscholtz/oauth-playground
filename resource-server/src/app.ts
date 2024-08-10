import express from 'express';
import api from './api';

const app = express();

app.use(function (_req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Pass to next layer of middleware
  next();
});

app.use('/api', api);
const httpPort = process.env.PORT ? parseInt(process.env.PORT) : 4242;
app.listen(httpPort);
console.log(`Listening on port ${httpPort}`);
