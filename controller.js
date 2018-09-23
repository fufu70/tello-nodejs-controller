var data = require('./assets/data.js');
var tello = require('./assets/tello.js');
var stdio = require('stdio');
var isInitalized = false;

function sendCommand(message) {

    if (message == 'quit') {
        client.close(); return;
    } else if (message == 'state') {
        console.log(data.currentState());
        getCommand();
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