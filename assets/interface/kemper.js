const stdio = require('stdio');
const data = require('./../data.js');
const euler = require('./../euler.js');
const kemper = require('./../kemper.js');

function streamData(data) {
    for (var i = 0; i < data.length; i ++) {
        euler.update(data[i]);
        kemper.update(data[i].time);
    }
}

module.exports = {
    stream: function(arg, callback) {
        if (arg == undefined) {
            stdio.question('Name of Data file', function (err, filename) {
                streamData(data.readFile(filename));
            });
        } else {
            streamData(data.readFile(arg));
        }
    }
}