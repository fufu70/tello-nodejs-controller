var PORT_READ = 8890;
var HOST = '0.0.0.0';
var stateString = undefined;
var isListening = false;

function init(callback) {

    var dgram = require('dgram');
    var server = dgram.createSocket('udp4');

    server.on('listening', function () {});
    server.on('message', function (message, remote) {
        stateString = message;

        if (!isListening) {
            isListening = true;
            callback();
        }
    });

    server.bind(PORT_READ, HOST);
}

function getStateFromString(stateString) {
    var split = new Buffer.from(stateString).toString().split(";");

    return {
        pitch: Number(split[0].split(":")[1]),
        roll:  Number(split[1].split(":")[1]),
        yaw:   Number(split[2].split(":")[1]),
        vgx:   Number(split[3].split(":")[1]),
        vgy:   Number(split[4].split(":")[1]),
        vgz:   Number(split[5].split(":")[1]),
        templ: Number(split[6].split(":")[1]),
        temph: Number(split[7].split(":")[1]),
        tof:   Number(split[8].split(":")[1]),
        h:     Number(split[9].split(":")[1]),
        bat:   Number(split[10].split(":")[1]),
        baro:  Number(split[11].split(":")[1]),
        time:  Number(split[12].split(":")[1]),
        agx:   Number(split[13].split(":")[1]),
        agy:   Number(split[14].split(":")[1]),
        agz:   Number(split[15].split(":")[1]),
    };
}

module.exports = {
    init: init,
    currentState: function() {
        if (stateString) {
            return getStateFromString(stateString);   
        }

        return {};
    }
}