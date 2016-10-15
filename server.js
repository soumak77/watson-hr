#! /usr/bin/env node
'use strict';

require('dotenv').config({silent: true});

['GOOGLE_ANALYTICS', 'API_KEY', 'CAPTCHA_SITE', 'CAPTCHA_SECRET'].forEach(function(key) {
  if (key in process.env) {
    process.env[key] = process.env[key].replace(/\"/g, '');
  }
});

// Deployment tracking
require('cf-deployment-tracker-client').track();

var server = require('./app');
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

server.listen(port, function() {
  console.log('Server running on port: %d', port);
});
