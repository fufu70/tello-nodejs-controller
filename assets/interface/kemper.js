const stdio = require('stdio');
const data = require('./../data.js');
const euler = require('./../euler.js');
const kemper = require('./../kemper.js');
var suggested_controls

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
        suggested_controls.push({
            thrustCommand: kemper.thrustCommand,
            phiCommand: kemper.phiCommand,
            thetaCommand: kemper.thetaCommand,
            psiCommand: kemper.psiCommand,
        });
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