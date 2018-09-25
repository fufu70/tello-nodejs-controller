var data = require('./assets/data.js');
var tello = require('./assets/tello.js');
var exports = require('./assets/exports.js');
var stdio = require('stdio');
var isInitalized = false;
var isQuitting = false;

function sendCommand(message) {

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
            getCommand();
            break;
        case 'position':
            console.log(data.currentPosition());
            getCommand();
            break;
        case 'start':
            data.startRecording();
            getCommand();
            break;
        case 'stop':
            data.stopRecording();
            getCommand();
            break;
        case 'reset':
            data.resetRecording();
            getCommand();
            break;
        case 'exportdata':
            stdio.question('Name of Data file', function (err, filename) {
                exports.exportToCSV(data.readFile(filename), filename);
            });
            break;
        case 'save':
            data.saveRecording(getCommand);
            break;
        case 'init':
            tello.init(function() {
                getCommand();
                isInitalized = true;
            }, messageCallback);
            break;
        default:
            var message = new Buffer.from(message);
            tello.command(message);
    }
}

function getCommand() {
    stdio.question('>', function (err, command) {
        sendCommand(command);
    });
}

function messageCallback(message, remote) {
    if (isInitalized) {
        console.log(remote.address + ':' + remote.port +' - ' + message);
        getCommand();
    }
}

getCommand();