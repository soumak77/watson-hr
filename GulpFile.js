/**
* Main Gulp File
**/

'use strict';

var gulp = require('gulp');
var glob = require('glob');
var path = require('path');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
glob.sync('*.js', {cwd: './gulp'}).map(function(file) {
  require(path.join(__dirname, 'gulp', file));
});

gulp.task('default', ['serve']);
