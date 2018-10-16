const stdio = require('stdio');
const data = require('./../data.js');
const euler = require('./../euler.js');
const kemper = require('./../kemper.js');
const multicopter = require('./../multicopter.js');

/**
 * Streams the data from the provided state file and feeds it
 * into the kemper controller. After the feed is complete it stores 
 * the data into a .json file.
 * 
 * @param  {Array} data State data over a period of time.
 * @return {Array}      A list of all the suggested controls.
 */
function getSuggestedControls(data) {
    var suggested_controls = [];

    for (var i = 0; i < data.length; i ++) {
        euler.update(data[i]);
        kemper.update(data[i].time);
        var obj = Object.assign(kemper.getState(), euler.motion);
        suggested_controls.push(Object.assign(obj, multicopter.getState()));
    }

    return suggested_controls;
}

module.exports = {
    stream: function(arg, callback) {
        if (arg == undefined) {
            stdio.question('Name of Data file', function (err, filename) {
                var controls = getSuggestedControls(data.readFile(filename));
                data.saveData(controls, filename + '_controls_', callback);
            });
        } else {
            var controls = getSuggestedControls(data.readFile(arg));
            data.saveData(controls, arg + '_controls_', callback);
        }
    }
}