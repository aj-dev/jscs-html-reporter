# jscs-html-reporter
[![Build Status](https://travis-ci.org/aj-dev/jscs-html-reporter.svg?branch=master)](https://travis-ci.org/aj-dev/jscs-html-reporter)
[![Dependencies](https://david-dm.org/aj-dev/jscs-html-reporter.svg)](https://david-dm.org/aj-dev/jscs-html-reporter#info=dependencies&view=table)
[![DevDependencies](https://david-dm.org/aj-dev/jscs-html-reporter/dev-status.svg)](https://david-dm.org/aj-dev/jscs-html-reporter/dev-status#info=dependencies&view=table)


An HTML reporter for [node-jscs](https://github.com/mdevils/node-jscs) and [grunt-jscs](https://github.com/jscs-dev/grunt-jscs).

## Getting started
Install using npm:

`npm install jscs-html-reporter --save-dev`

## Usage

#### When using with [node-jscs](https://github.com/mdevils/node-jscs)
Set the path to `jscs-html-reporter`. Command line example:

`jscs . --reporter jscs-html-reporter.js`

#### When using with [grunt-jscs](https://github.com/jscs-dev/grunt-jscs)
Configure `jscs` in `Gruntfile.js` so that `reporter` points to `jscs-html-reporter.js` and `reporterOutput` points to some HTML file.

```javascript
jscs: {
    src: 'path/to/files/*.js',
    options: {
        reporter: '/path/to/jscs-html-reporter.js',
        reporterOutput: '/path/to/reporter-output.html'
    }
}
```

## Example
Coming soon...

## License
Licensed under the MIT license. Copyright (c) 2015 Audrius Jakumavicius
