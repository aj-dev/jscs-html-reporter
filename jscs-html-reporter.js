/* global process, require */

var path = require('path');

/**
 * @param {Array} errorsCollection
 */
module.exports = function (errorsCollection) {

    'use strict';

    var config = this.options,
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
            '<link href="' + reporterDirName + '/jscs-html-reporter.css" rel="stylesheet">',
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
            '<span class="errorHeader">',
            '<span class="errorNumber">' + errorCount + '.</span>',
            error.message + ' - ',
            '<span class="file">',
            '<a href="../../../' + errors.getFilename() + '" target="_blank">' + errors.getFilename() + '</a>',
            ' (line:' + error.line + ', column:' + (error.column + 1) + ')',
            '</span>',
            '</span>',
            '<div class="errorMessage hide">' + encodeHtml(errors.explainError(error)) + '</div></li>'
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
            '<script type="text/javascript" src="' + reporterDirName + '/toggle.js"></script>',
            '</body>',
            '</html>'
        ].join('');
    }

    /**
     * @description Combines all HTML partials into one and outputs to console.
     */
    function combineAndOutputAllPartials() {
        process.stdout.write([
            header,
            errorsHtml,
            footer
        ].join(''));
    }

    /**
     * @description Returns jscs-html-reporter's directory name relative to report output directory.
     * @returns {String|Error} Reporter's directory name or error if not found
     */
    function setReporterDirName() {
        var dirName = path.dirname(path.relative(path.dirname(config.reporterOutput), config.reporter)).replace(/\\/g, '/');

        if (!dirName) {
            return new Error('Could not resolve relative path to jscs-html-reporter');
        }

        reporterDirName = dirName;
    }

    generateReport();
};
