var data = require('./assets/data.js');
var tello = require('./assets/tello.js');
var exportLib = require('./assets/export.js');
var multicopter = require('./assets/multicopter.js');
var stdio = require('stdio');
var isInitalized = false;
var isQuitting = false;

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
 * The message can be a two part message, a primary part that controls
 * the switch case, and a secondary part that passes information to the
 * process running inside of the case.
 * 
 * @param  {string}   message  The primary and secondary message
 * @param  {Function} callback The function to call once the case is complete.
 */
function sendCommand(message, callback) {
    var messageSplit = message.split(" ");
    if (messageSplit.length <= 0) {
        console.log("Message must be a parsable string");
        return;
    }
    var primaryMessage = messageSplit[0];
    var secondaryMessage = (messageSplit.length >= 2) ? messageSplit[1] : undefined;

    switch(primaryMessage.toLowerCase()) 
    {        
        case 'quit':
            tello.command('emergency');
            exit();
            break;
        case 'state':
            console.log(data.currentState());
            callback();
            break;
        case 'position':
            console.log(data.currentPosition());
            callback();
            break;
        case 'start':
            data.startRecording();
            callback();
            break;
        case 'stop':
            data.stopRecording();
            callback();
            break;
        case 'reset':
            data.resetRecording();
            callback();
            break;
        case 'save':
            if (secondaryMessage == undefined) {
                data.saveRecording("", callback);
            } else {
                data.saveRecording(secondaryMessage, callback);
            }
            break;
        case 'csv':
            if (secondaryMessage == undefined) {
                stdio.question('Name of Data file', function (err, filename) {
                    exportLib.exportToCSV(data.readFile(filename), filename, callback);
                });
            } else {
                exportLib.exportToCSV(data.readFile(secondaryMessage), secondaryMessage, callback);
            }
            break;
        case 'read':
            if (secondaryMessage == undefined) {
                stdio.question('Name of Command file', function (err, filename) {
                    readCommandFile(filename);
                });
            } else {
                readCommandFile(secondaryMessage);
            }
            break;
        case 'init':
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
            break;
        case 'compos':
            get3DVector(function(vector) {
                multicopter.commandedPosition = vector;
                console.log(multicopter.commandedPosition);
                callback();
            });
            break;
        case 'comvel':
            get3DVector(function(vector) {
                multicopter.commandedVelocity = vector;
                console.log(multicopter.commandedVelocity);
                callback();
            });
            break;
        case 'comacc':
            get3DVector(function(vector) {
                multicopter.commandedAcceleration = vector;
                console.log(multicopter.commandedAcceleration);
                callback();
            });
            break;
        default:
            if (isInitalized) {
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

function exit() {
    setTimeout(function() {
        process.exit();
    }, 200);
}

/**
 * Read Input or request input
 */

if (process.argv[2] !== undefined && typeof(process.argv[2]) == "string" && process.argv[2].indexOf("read") == 0) {
    sendCommand(process.argv[2]);
} else {
    getCommand();
}