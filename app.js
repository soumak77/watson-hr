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
var fs = require('fs');
var extend = require('extend');
var path = require('path');
var async = require('async');
var watson = require('watson-developer-cloud');
var uuid = require('uuid');
var os = require('os');
var vcapServices = require('vcap_services');

var ONE_HOUR = 3600000;
var TWENTY_SECONDS = 20000;

// Bootstrap application settings
require('./config/express')(app);

// Alchemy Language
var alchemyService = new watson.AlchemyLanguageV1({
  api_key: '95ed8246b8d12670d230389b06d2ded65c8dea4c'
});

// Visual Recognition
var visualRecognition = new watson.VisualRecognitionV3({
  api_key: 'e92b1115663caad5d5a0d2e325c77d4d26548d09',
  version_date: '2016-05-20'
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
  "password": "I7UwCX8JVqLt",
  "username": "ea595884-31ba-47c3-ac79-ea4c104dc1ef",
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

function deleteUploadedFile(readStream) {
  fs.unlink(readStream.path, function(e) {
    if (e) {
      console.log('error deleting %s: %s', readStream.path, e);
    }
  });
}

app.post('/visual/classify', app.upload.single('images_file'), function(req, res) {
  var params = {
    url: null,
    images_file: null
  };

  if (req.file) { // file image
    params.images_file = fs.createReadStream(req.file.path);
  } else if (req.body.url && req.body.url.indexOf('images') === 0) { // local image
    params.images_file = fs.createReadStream(path.join('public', req.body.url));
  } else if (req.body.image_data) {
    // write the base64 image to a temp file
    var resource = parseBase64Image(req.body.image_data);
    var temp = path.join(os.tmpdir(), uuid.v1() + '.' + resource.type);
    fs.writeFileSync(temp, resource.data);
    params.images_file = fs.createReadStream(temp);
  } else if (req.body.url) { // url
    params.url = req.body.url;
  } else { // malformed url
    return res.status(400).json({ error: 'Malformed URL', code: 400 });
  }

  if (params.images_file) {
    delete params.url;
  } else {
    delete params.images_file;
  }
  var methods = [];
  if (req.body.classifier_id || process.env.OVERRIDE_CLASSIFIER_ID) {
    params.classifier_ids = req.body.classifier_id ? [req.body.classifier_id] : [process.env.OVERRIDE_CLASSIFIER_ID];
    methods.push('classify');
  } else {
    methods.push('classify');
    methods.push('detectFaces');
    methods.push('recognizeText');
  }

  // run the 3 classifiers asynchronously and combine the results
  async.parallel(methods.map(function(method) {
    var fn = visualRecognition[method].bind(visualRecognition, params);
    if (method === 'recognizeText' || method === 'detectFaces') {
      return async.reflect(async.timeout(fn, TWENTY_SECONDS));
    } else {
      return async.reflect(fn);
    }
  }), function(err, results) {
    // delete the recognized file
    if (params.images_file && !req.body.url) {
      deleteUploadedFile(params.images_file);
    }

    if (err) {
      console.log(err);
      return res.status(err.code || 500).json(err);
    }
    // combine the results
    var combine = results.map(function(result) {
      if (result.value && result.value.length) {
        // value is an array of arguments passed to the callback (excluding the error).
        // In this case, it's the result and then the request object.
        // We only want the result.
        result.value = result.value[0];
      }
      return result;
    }).reduce(function(prev, cur) {
      return extend(true, prev, cur);
    });
    if (combine.value) {
      // save the classifier_id as part of the response
      if (req.body.classifier_id) {
        combine.value.classifier_ids = req.body.classifier_id;
      }
      combine.value.raw = {};
      methods.map(function(methodName, idx) {
        combine.value.raw[methodName] = encodeURIComponent(JSON.stringify(results[idx].value));
      });
      res.json(combine.value);
    } else {
      res.status(400).json(combine.error);
    }
  });
});

app.get('/', function(req, res) {
  res.render('index');
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
