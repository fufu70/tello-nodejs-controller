var data = require('./data.js');
var tello = require('./tello.js');
var exportLib = require('./export.js');
var multicopter = require('./multicopter.js');
var stdio = require('stdio');
var isInitalized = false;
var isQuitting = false;
var commandFunctions = {
    quit:     quit,
    state:    state,
    position: position,
    start:    start,
    stop:     stop,
    reset:    reset,
    save:     save,
    csv:      csv,
    read:     read,
    init:     init,
    compos:   compos,
    comvel:   comvel,
    comacc:   comacc,
};

/**
 * Reads a command file and then runs each command singularly.
 * 
 * @param  {string} filename The name of the command file in the commands folder.
 */
function readCommandFile(filename) {
    var commandArr = data.readFile('../commands/' + filename);
    var currentIndex = 0;

    function nextCommand() {
        if (currentIndex >= commandArr.length) {
            getCommand();
        } else {

            console.log("call " + commandArr[currentIndex]);
            sendCommand(commandArr[currentIndex], function() {
                currentIndex ++;
                nextCommand();
            });
        }
    }

    nextCommand();
}

/**
 * Gets the xyz value and sends it back to the callback function as a object.
 * 
 * @param  {Function} callback To call once all user information is gathered.
 *                             Passes a object: {x: 0, y: 0, z: 0}
 */
function get3DVector(callback) {
    stdio.question('X', function (err, x) {
        stdio.question('Y', function (err, y) {
            stdio.question('Z', function (err, z) {
                callback({
                    x: parseInt(x),
                    y: parseInt(y),
                    z: parseInt(z)
                });
            });
        });
    });
}

/**
 * Checks that the string provided is a 3D vector. The expected string is of format:
 * "{x:1.0,y:1.0,z:1.0}"
 * It should not contain any spaces.
 * 
 * @param  {string} str The string to match
 * @return {boolean}    True if the the string is a 3D vector.
 */
function is3DVector(str) {
    try {
        var vector = JSON.parse(str);
        return typeof(vector.x) == 'number' 
            && typeof(vector.y) == 'number' 
            && typeof(vector.z) == 'number';
    } catch(err) {
        return false;
    }
}

/**
 * Quits the current program and shuts down the tello quickly.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Ignored
 */
function quit(arg, callback) {
    tello.command('emergency');
    setTimeout(function() {
        process.exit();
    }, 200);
}

/**
 * Outputs the current state of the tello
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function state(arg, callback) {
    console.log(data.currentState());
    callback();
}

/**
 * Outputs the current position of the tello
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function position(arg, callback) {
    console.log(data.currentPosition());
    callback();
}

/**
 * Starts recording the tello's data stream.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function start(arg, callback) {
    data.startRecording();
    callback();
}

/**
 * Stops recording the tello's data stream.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function stop(arg, callback) {
    data.stopRecording();
    callback();
}

/**
 * Clears the tello's data stream collected.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function reset(arg, callback) {
    data.resetRecording();
    callback();
}

/**
 * Saves the tello's collected data stream. Stores the stream as a JSON
 * into the provided file. The file is stored in the "data" directory.
 * 
 * @param  {string}   filename The filename to save to.
 * @param  {Function} callback Called after the action is complete
 */
function save(filename, callback) {
    if (filename == undefined) {
        data.saveRecording("", callback);
    } else {
        data.saveRecording(filename, callback);
    }
}

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

/**
 * Reads a command file from the "commands" directory.
 * 
 * @param  {string}   arg      The "commands" filename.
 * @param  {Function} callback Called after the action is complete.
 */
function read(arg, callback) {
    if (arg == undefined) {
        stdio.question('Name of Command file', function (err, filename) {
            readCommandFile(filename);
        });
    } else {
        readCommandFile(arg);
    }
}

/**
 * Initializes the Tello drone.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete.
 */
function init(arg, callback) {
    if (!isInitalized) {
        tello.init(function() {
            isInitalized = true;
            callback();
        }, function(telloMessage, remote) {
            messageCallback(telloMessage, remote, callback);
        });
    } else {
        console.log("Tello is already initalized. To initialize again, run quit and run the program again");
    }
}

/**
 * Sets the commanded position of the multicopter from the provided
 * 3D vector.
 * 
 * @param  {string}   arg      3D vector.
 * @param  {Function} callback Called after the position is set.
 */
function compos(arg, callback) {
    if (arg == undefined || is3DVector(arg)) {
        get3DVector(function(vector) {
            multicopter.commandedPosition = vector;
            console.log(multicopter.commandedPosition);
            callback();
        });
    } else {
        multicopter.commandedPosition = JSON.parse(arg);
        console.log("Commanded Position : " + arg);
        callback();
    }
}

/**
 * Sets the commanded velocity of the multicopter from the provided
 * 3D vector.
 * 
 * @param  {string}   arg      3D vector.
 * @param  {Function} callback Called after the velocity is set.
 */
function comvel(arg, callback) {
    if (arg == undefined || is3DVector(arg)) {
        get3DVector(function(vector) {
            multicopter.commandedVelocity = vector;
            console.log(multicopter.commandedVelocity);
            callback();
        });
    } else {
        multicopter.commandedVelocity = JSON.parse(arg);
        console.log("Commanded Velocity : " + arg);
        callback();
    }
}

/**
 * Set the commanded acceleration of the multicopter.
 * 
 * @param  {string}   arg      3D vector.
 * @param  {Function} callback Called after the velocity is set.
 */
function comacc(arg, callback) {
    if (arg == undefined || is3DVector(arg)) {
        get3DVector(function(vector) {
            multicopter.commandedAcceleration = vector;
            console.log(multicopter.commandedAcceleration);
            callback();
        });
    } else {
        multicopter.commandedAcceleration = JSON.parse(arg);
        console.log("Commanded Acceleration : " + arg);
        callback();
    }
}

/**
 * The message can be a two part message, a primary part that controls
 * the switch case, and a secondary part that passes information to the
 * process running inside of the case.
 * 
 * @param  {string}   message  The command and argument.
 * @param  {Function} callback The function to call once command is complete.
 */
function sendCommand(message, callback) {
    var messageSplit = message.split(" ");
    if (messageSplit.length <= 0) {
        console.log("Message must be a parsable string");
        return;
    }
    var command = messageSplit[0];
    var arg = (messageSplit.length >= 2) ? messageSplit[1] : undefined;

    if (commandFunctions[command] != undefined) {
        commandFunctions[command](arg, callback);
    } else if (isInitalized) {
        if (message.indexOf("rc") == 0) {
            tello.command(new Buffer.from(message));
            callback();
        } else {
            tello.command(new Buffer.from(message));
        }
    } else {
        console.log("Initialize before sending a command");
    }
}

function getCommand() {
    stdio.question('>', function (err, command) {
        sendCommand(command, getCommand);
    });
}

function messageCallback(telloMessage, remote, callback) {
    if (isInitalized) {
        console.log(remote.address + ':' + remote.port +' - ' + telloMessage);
        callback();
    }
}

module.exports = {
    init: getCommand,
    send: sendCommand
}