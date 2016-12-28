/* global process, require */

var path = require('path');
var fs = require('fs');
var through = require('through2');
var handlebars = require('handlebars');

handlebars.registerHelper('inc', function (value) {
    return parseInt(value, 10) + 1;
});

var reporter = {
    /**
     * Returns reporter's output path or default file name relative to CWD
     * @param {string} outputPath
     * @returns {string}
     */
    getOutputPath: function (outputPath) {
        return path.relative(process.cwd(), outputPath || 'jscs-html-report.html');
    },

    /**
     * Returns relative path from output path to reporter
     * @param {string} outputPath
     * @returns {string}
     */
    getRelativePath: function (outputPath) {
        return path.relative(path.dirname(outputPath), __dirname);
    },

    /**
     * Returns transformed array of errors
     * @param {Array} errors
     * @param {string} outputDir
     * @returns {Array}
     */
    processErrors: function (errors, outputDir) {
        return errors.getErrorList().map(function (error) {
            return {
                message: error.message,
                line: error.line,
                column: error.column,
                reason: errors.explainError(error),
                fileName: path.relative(outputDir, errors.getFilename())
            };
        });
    },

    /**
     * Compiles handlebars template
     * @param {Object} context
     * @returns {string}
     */
    compileTemplate: function (context) {
        var template = fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf-8');

        return handlebars.compile(template)(context);
    },

    /**
     * Saves report to an output path
     * @param {Object} data
     * @param {string} outputPath
     * @param {boolean} [isGrunt]
     */
    saveReport: function (data, outputPath, isGrunt) {
        var html = this.compileTemplate(data);

        if (isGrunt) {
            process.stdout.write(html);

            return;
        }

        fs.writeFileSync(outputPath, html);

        console.log('*** JSCS report saved to %s\n', outputPath);
    }
};

/**
 * JSCS Gulp reporter
 * @param {Object} [options]
 * @returns {*}
 */
function jscsGulpReporter(options) {
    var options = options || {};
    var outputPath = reporter.getOutputPath(options.reporterOutput);
    var relativeReporterPath = reporter.getRelativePath(outputPath);
    var failedFiles = null;
    var errorsCollection;

    return through.obj(function (file, enc, callback) {
        if (file.jscs && !file.jscs.success) {
            (failedFiles = failedFiles || []).push(file.path);

            errorsCollection = (errorsCollection || []).concat(reporter.processErrors(file.jscs.errors, path.dirname(outputPath)));
        }

        callback(null, file);
    }, function (callback) {
        if (failedFiles) {
            reporter.saveReport({errorsCollection: errorsCollection, relativeReporterPath: relativeReporterPath}, outputPath);
        }

        callback();
    });
}

/**
 * JSCS reporter
 * @param {Array} files
 */
function jscsReporter(files) {
    // For grunt-jscs we need `this.options`, for node-jscs - `this`
    var options = this.options || this;
    var isGrunt = Boolean(this.options);
    var outputPath = reporter.getOutputPath(options.reporterOutput);
    var relativeReporterPath = reporter.getRelativePath(outputPath);

    if (isGrunt && !options.reporterOutput) {
        console.error(new Error('JSCS HTML reporter `reporterOutput` path not specified in grunt task!\n'));

        process.exit(1);
    }

    function generateReport() {
        var errorsCollection = [];

        files.forEach(function (errors) {
            if (!errors.isEmpty()) {
                errorsCollection = errorsCollection.concat(reporter.processErrors(errors, path.dirname(outputPath)));
            }
        });

        reporter.saveReport({errorsCollection: errorsCollection, relativeReporterPath: relativeReporterPath}, outputPath, isGrunt);
    }

    generateReport();
}

module.exports = jscsReporter;

// Expose path to reporter so it can be configured in grunt-jscs task
module.exports.path = __dirname;

module.exports.gulpReporter = jscsGulpReporter;
