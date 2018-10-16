const stdio = require('stdio');
const exportLib = require('./../export.js');
const data = require('./../data.js')

/**
 * Converts the provided data file to a csv file in the "exports" directory.
 * 
 * @param  {string}   arg      The name of the data file.
 * @param  {Function} callback Called after the action is complete.
 */
function csv(arg, callback) {
    if (arg == undefined) {
        stdio.question('Name of Data file', function (err, filename) {
            exportLib.exportToCSV(data.readFile(filename), filename, callback);
        });
    } else {
        exportLib.exportToCSV(data.readFile(arg), arg, callback);
    }
}

module.exports = {
    csv: csv,
}