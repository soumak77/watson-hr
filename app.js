/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');
var extend = require('util')._extend;
var vcapServices = require('vcap_services');

// Bootstrap application settings
require('./config/express')(app);

// Alchemy Language
var alchemyService = new watson.AlchemyLanguageV1({
  api_key: '5b18f579f90d11e07c9c1187174fd78fc1cf5984'
});

// Visual Recognition
var visualRecognition = new watson.VisualRecognitionV3({
  api_key: '044f60c328e802fc25ebb603adb2fa4b642a3748',
  version_date: '2016-05-19'
});

// Speech to Text
var speechToTextConfig = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || '9075db66-6293-4402-9f10-e45b2d5395eb',
  password: process.env.STT_PASSWORD || 'FnGWsjFG7Pok'
}, vcapServices.getCredentials('speech_to_text'));
var speechToTextService = watson.authorization(speechToTextConfig);

// Tone Analyzer
var toneAnalyzerService = watson.tone_analyzer({
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api/',
  username: '1bc5e040-6446-4ba0-a58a-a786e8987d24',
  password: 'Wdu5FVWgFUZV',
  version_date: '2016-05-19',
  version: 'v3'
});

// Tradeoff Analytics
var tradeoffAnalyticsConfig = require('./config/tradeoff-analytics-config');
tradeoffAnalyticsConfig.setupToken(app, {//for dev purposes. in bluemix it is taken from VCAP.
  url: process.env.TA_URL || 'https://gateway.watsonplatform.net/tradeoff-analytics/api/v1',
  username: process.env.TA_USERNAME || '1547ff63-1981-4bf8-ba14-c75d54b4b5a3',
  password: process.env.TA_PASSWORD || 'QpWTwXfvMMAy',
  version: 'v1'
});

// Personality Insights
var personalityInsights = watson.personality_insights({
  "password": "8AROxeTJHZCT",
  "username": "51090438-d608-4ad2-be5d-01fbe46bb0c4",
  "version": "v2",
  "headers": {
    "X-Watson-Learning-Opt-Out": 1
  }
});

app.post('/alchemy/:method', function(req, res, next) {
  var method = req.params.method;
  if (typeof alchemyService[method] === 'function') {
    alchemyService[method](req.body, function(err, response) {
      if (err) {
        return next(err);
      }
      return res.json(response);
    });
  } else {
    next({code: 404, error: 'Unknown method: ' + method });
  }
});

app.post('/personality', function(req, res, next) {
  personalityInsights.profile(req.body, function(err, response) {
    if (err) {
      return next(err);
    }
    return res.json(response);
  });
});

app.get('/', function(req, res) {
  res.render('index');
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
