var data = require('./data.js');
var dgram = require('dgram');
var PORT_SEND = 8889;
var HOST = '192.168.10.1';
var client = dgram.createSocket('udp4');

function init(initCallback, messageCallback) {
    var isInitalized = false;
    client.on('message', function (message, remote) {
        if (!isInitalized) {
            isInitalized = true;
            data.init(function() {
                initCallback(message, remote);
            });
        } else {
            messageCallback(message, remote);
        }
    });

    client.bind(PORT_SEND);
    command(new Buffer.from('command'));
}

function command(message) {
    client.send(message, 0, message.length, PORT_SEND, HOST);
}

module.exports = {
    init: init,
    command: command
}