var tello = require('./tello.js');
var exportInterface = require('./interface/export.js');
var dataInterface = require('./interface/data.js');
var multicopterInterface = require('./interface/multicopter.js');
var kemperInterface = require('./interface/kemper.js');
var stdio = require('stdio');
var isInitalized = false;
var isQuitting = false;
var commandFunctions = {
    quit:     quit,
    read:     read,
    init:     init,
    csv:      exportInterface.csv,
    state:    dataInterface.state,
    position: dataInterface.position,
    start:    dataInterface.start,
    stop:     dataInterface.stop,
    reset:    dataInterface.reset,
    save:     dataInterface.save,
    compos:   multicopterInterface.setCommandedPosition,
    comvel:   multicopterInterface.setCommandedVelocity,
    comacc:   multicopterInterface.setCommandedAcceleration,
    kemper:   kemperInterface.stream,
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