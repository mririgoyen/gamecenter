/* eslint-disable no-console */
const http = require('http');

const request = http.request({ host: 'localhost', path: '/api/v1/health', port: 1100, timeout: 2000 }, (res) => {
  res.on('end', () => process.exit(res.statusCode === 200 ? 0 : 1));
  res.on('error', () => process.exit(1));
  res.resume();
});

request.on('error', (err) => {
  console.error('Healthcheck Error', err);
  process.exit(1);
});

request.end();
