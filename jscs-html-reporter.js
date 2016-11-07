/* global process, require */

var path = require('path');
var fs = require('fs');

/**
 * @param {Array} errorsCollection
 */
module.exports = function (errorsCollection) {

    'use strict';

    // For grunt-jscs we need `this.options`, for node-jscs - `this`, for gulp-jscs - `{}`
    var config = this ? (this.options || this) : {},
        reporterDirName,
        errorCount = 0,
        header = '',
        errorsHtml = '',
        footer = '';

    /**
     * @description Generates HTML report of style errors.
     */
    function generateReport() {
        setReporterDirName();
        createHeaderPartial();
        generateErrorsList();
        createFooterPartial();
        combineAndOutputAllPartials();
    }

    /**
     * @description Creates header part of HTML page.
     */
    function createHeaderPartial() {
        header += [
            '<!DOCTYPE html><html lang="en">',
            '<head><meta charset="UTF-8"><title>JSCS HTML Reporter</title>',
            '<link href="' + reporterDirName + '/jscs-html-reporter/jscs-html-reporter.css" rel="stylesheet">',
            '</head>',
            '<body>',
            '<div id="wrapper">'
        ].join('');
    }

    /**
     * @description Outputs errors from each error set.
     */
    function generateErrorsList() {
        errorsHtml += '<ul class="errors">';

        errorsCollection.forEach(function (errors) {
            if (!errors.isEmpty()) {
                errors.getErrorList().forEach(function (error) {
                    errorCount++;
                    createListElement(error, errors, errorCount);
                });
            }
        });

        header += (errorCount ? '<header class="error">Total number of errors: ' + errorCount : '<h1>No errors found!') + '</header>';
        errorsHtml += '</ul>';
    }

    /**
     * @description Creates li element with error information.
     * @param {Object} error Current error object
     * @param {Array} errors A list of errors
     * @param {Number} errorCount Error number
     */
    function createListElement(error, errors, errorCount) {
        errorsHtml += [
            '<li class="error">',
            '<span class="error-header">',
            '<span class="error-number">' + errorCount + '.</span>',
            error.message + ' - ',
            '<span class="file">',
            '<a href="' + path.resolve(process.cwd(), errors.getFilename()) + '" target="_blank">' + errors.getFilename() + '</a>',
            '<span class="error-location"> (line:' + error.line + ', column:' + (error.column + 1) + ')</span>',
            '</span>',
            '</span>',
            '<div class="error-message hide">' + encodeHtml(errors.explainError(error)) + '</div>',
            '</li>'
        ].join('');
    }

    /**
     * @description Encodes HTML characters in strings.
     * @param {String} string
     * @returns {String} Encoded string
     */
    function encodeHtml(string) {
        var entitiesMap = {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };

        return (string || '').replace(/(&|"|<|>)/g, function (entity) {
            return entitiesMap[entity];
        });
    }

    /**
     * @description Creates footer part of HTML page.
     */
    function createFooterPartial() {
        footer += [
            '</div>',
            '<script type="text/javascript" src="' + reporterDirName + '/jscs-html-reporter/toggle.js"></script>',
            '</body>',
            '</html>'
        ].join('');
    }

    /**
     * @description Combines all HTML partials into one and outputs to console.
     */
    function combineAndOutputAllPartials() {
        var outputPath,
            data = [
                header,
                errorsHtml,
                footer
            ].join('');

        if (isReporterOutputSet()) {
            process.stdout.write(data);
        } else {
            outputPath = path.resolve(process.cwd(), 'jscs-html-report.html');
            fs.writeFileSync(outputPath, data);
            console.log('>> jscs report written to', outputPath);
        }
    }

    /**
     * @description Checks whether reporter output path is set in `config`.
     * `reporterOutput` property can only be set using `grunt-jscs`.
     * @returns {Boolean}
     */
    function isReporterOutputSet() {
        return !!(config && config.reporterOutput);
    }

    /**
     * @description Returns jscs-html-reporter's directory name relative to report output directory.
     * @returns {String|Error} Reporter's directory name or error if not found
     */
    function setReporterDirName() {
        var dirName;

        if (isReporterOutputSet()) {
            dirName = path.dirname(path.relative(path.dirname(config.reporterOutput), config.reporter)).replace(/\\/g, '/');
        } else {
            dirName = path.dirname(path.relative(process.cwd(), config.path || config.reporter || 'node_modules/jscs-html-reporter')).replace(/\\/g, '/');
        }

        if (!dirName) {
            return new Error('Could not resolve relative path to jscs-html-reporter');
        }

        reporterDirName = dirName;
    }

    generateReport();
};

// Expose path to reporter so it can be configured in grunt-jscs task
module.exports.path = __dirname;
