var data = require('./assets/data.js');
var tello = require('./assets/tello.js');
var exports = require('./assets/exports.js');
var stdio = require('stdio');
var isInitalized = false;
var isQuitting = false;

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

function sendCommand(message, callback) {

    switch(message.toLowerCase()) 
    {        
        case 'quit':
            tello.command('emergency');
            setTimeout(function() {
                process.exit();
            }, 200);
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
            data.saveRecording(callback);
            break;
        case 'exportdata':
            stdio.question('Name of Data file', function (err, filename) {
                exports.exportToCSV(data.readFile(filename), filename);
            });
            break;
        case 'read':
            stdio.question('Name of Command file', function (err, filename) {
                readCommandFile(filename);
            });
            break;
        case 'init':
            tello.init(function() {
                isInitalized = true;
                callback();
            }, function(message, remote) {
                messageCallback(message, remote, callback);
            });
            break;
        default:
            var message = new Buffer.from(message);
            tello.command(message);
    }
}

function getCommand() {
    stdio.question('>', function (err, command) {
        sendCommand(command, getCommand);
    });
}

function messageCallback(message, remote, callback) {
    if (isInitalized) {
        console.log(remote.address + ':' + remote.port +' - ' + message);
        callback();
    }
}

getCommand();