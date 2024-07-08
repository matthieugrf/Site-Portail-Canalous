// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
    })
  );
};
