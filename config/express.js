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

// Module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var multer = require('multer');

module.exports = function(app) {
  // Configure Express
  app.set('view engine', 'ejs');
  require('ejs').delimiter = '$';
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Setup static public directory
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Setup the upload mechanism
  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, os.tmpdir());
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  var upload = multer({
    storage: storage
  });
  app.upload = upload;

  // Only loaded when SECURE_EXPRESS is `true`
  if (process.env.VCAP_APPLICATION) {
    require('./security')(app);
  }
};
