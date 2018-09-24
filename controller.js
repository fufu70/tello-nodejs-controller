var data = require('./assets/data.js');
var tello = require('./assets/tello.js');
var stdio = require('stdio');
var isInitalized = false;
var isQuitting = false;

function sendCommand(message) {

    if (message == 'quit') {
        tello.command('emergency');
        setTimeout(function() {
            process.exit();
        }, 200);
    } else if (message == 'state') {
        console.log(data.currentState());
        getCommand();
    } else if (message == 'position') {
        console.log(data.currentPosition());
        getCommand();
    } else if (message == 'start') {
        data.startRecording();
        getCommand();
    } else if (message == 'stop') {
        data.stopRecording();
        getCommand();
    } else if (message == 'reset') {
        data.resetRecording();
        getCommand();
    } else if (message == 'save') {
        data.saveRecording(getCommand);
    } else {
        var message = new Buffer.from(message);
        tello.command(message);
    }
}

function getCommand() {
    stdio.question('> ', function (err, command) {
        sendCommand(command);
    });
}

function messageCallback(message, remote) {
    if (isInitalized) {
        console.log(remote.address + ':' + remote.port +' - ' + message);
        getCommand();
    }
}

tello.init(function() {
    getCommand();
    isInitalized = true;
}, messageCallback);