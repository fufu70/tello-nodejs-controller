var fs = require('fs');

/**
 * Exports Data, an array with objects, to a CSV file.
 * 
 * @param  {array}  data     An array with objects.
 * @param  {string} fileName [description]
 */
function exportToCSV(data, fileName, callback) {
    if (data.length <= 0) {
        return;
    }

    var csvStringArr = [];
    var keys = Object.keys(data[0]);
    csvStringArr.push(keys.join(','));

    for (var i = 0; i < data.length; i ++) {
        var dataArr = [];
        for (var j = 0; j < keys.length; j ++) {
            dataArr.push(data[i][keys[j]]);
        }
        csvStringArr.push(dataArr.join(','));

    }

    fs.writeFile('./exports/' + fileName + '.csv', csvStringArr.join('\n'), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The csv file, " + fileName + ".csv was saved!");
        callback();
    });
}

function getFileName(filename) {
    return './data/' + filename.replace(".json", "") + '.json';
}

module.exports = {
    exportToCSV: exportToCSV
};