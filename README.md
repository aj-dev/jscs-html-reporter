# jscs-html-reporter [![npmVersion](http://img.shields.io/npm/v/jscs-html-reporter.svg)](https://www.npmjs.org/package/jscs-html-reporter)
[![Build Status](https://travis-ci.org/aj-dev/jscs-html-reporter.svg?branch=master)](https://travis-ci.org/aj-dev/jscs-html-reporter)
[![Dependencies](https://david-dm.org/aj-dev/jscs-html-reporter.svg)](https://david-dm.org/aj-dev/jscs-html-reporter#info=dependencies&view=table)
[![DevDependencies](https://david-dm.org/aj-dev/jscs-html-reporter/dev-status.svg)](https://david-dm.org/aj-dev/jscs-html-reporter#info=devDependencies&view=table) [![npm](https://img.shields.io/npm/dm/jscs-html-reporter.svg)](https://www.npmjs.com/package/jscs-html-reporter)


An HTML reporter for [node-jscs](https://github.com/mdevils/node-jscs), [grunt-jscs](https://github.com/jscs-dev/grunt-jscs) and [gulp-jscs](https://github.com/jscs-dev/gulp-jscs).

## Getting started
Install using npm:

`npm install jscs-html-reporter --save-dev`

## Usage

#### When using with [node-jscs](https://github.com/mdevils/node-jscs)
Set the path to `jscs-html-reporter`. Command line example:

`jscs . --reporter node_modules/jscs-html-reporter/jscs-html-reporter.js`

Report will be written to `jscs-html-report.html` in current working directory.

#### When using with [grunt-jscs](https://github.com/jscs-dev/grunt-jscs)
Configure `jscs` in `Gruntfile.js` so that `reporter` points to `jscs-html-reporter.js` and `reporterOutput` points to some HTML file within the project.

```javascript
jscs: {
    src: [
    	'path/to/files/*.js',
    	'another/path/to/files/**/*.js'
    ],
    options: {
        maxErrors: null,
        reporter: require('jscs-html-reporter').path,
        reporterOutput: '/path/to/jscs-html-report.html'
    }
}
```
#### When using with [gulp-jscs](https://github.com/jscs-dev/gulp-jscs)
Pipe jscs files to the reporter and provide an optional output path within the project:
```javascript
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jscsGulpHtmlReporter = require('jscs-html-reporter').gulpReporter;

gulp.task('default', function () {
    return gulp.src(['path/to/files/*.js', 'another/path/to/files/**/*.js'])
               .pipe(jscs())
               .pipe(jscsGulpHtmlReporter({reporterOutput: '/path/to/jscs-html-report.html'}))
});
```
Report will be written to `reporterOutput` if specified, otherwise to `jscs-html-report.html` in current working directory.

## Example
![alt text](https://raw.githubusercontent.com/aj-dev/jscs-html-reporter/master/jscs-html-reporter.png 'JSCS HTML Reporter output')

## License
Licensed under the MIT license. Copyright (c) 2015 - 2016 Audrius Jakumavicius
