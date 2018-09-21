var dgram = require('dgram');
var stdio = require('stdio');
var PORT_SEND = 8889;
var HOST = '192.168.10.1';

var client = dgram.createSocket('udp4');

client.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    getCommand();
});

client.bind(PORT_SEND);

function sendCommand(message) {

    if (message == 'quit') {
        client.close(); return;
    }

    var message = new Buffer.from(message);
    client.send(message, 0, message.length, PORT_SEND, HOST);
}

function getCommand() {
    stdio.question('> ', function (err, command) {
        sendCommand(command);
    });
}

