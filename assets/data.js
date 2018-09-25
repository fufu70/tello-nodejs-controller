var fs = require('fs');
var PORT_READ = 8890;
var HOST = '0.0.0.0';
var stateString = undefined;
var isListening = false;
var isRecording = false;
var time;
var position = {
    x: 0,
    y: 0,
    z: 0,
}
var recording = [];

function init(callback) {

    var dgram = require('dgram');
    var server = dgram.createSocket('udp4');

    server.on('listening', function () {});
    server.on('message', function (message, remote) {
        stateString = message;

        if (!isListening) {
            isListening = true;
            time = Date.now();
            callback();
        } else if (isRecording) {
            recordData();
        }
    });

    server.bind(PORT_READ, HOST);
}

function recordData() {
    recording.push(getState());
}

function saveData(callback) {

    var recordingStringArr = [];

    for (var i = 0; i < recording.length; i ++) {
        var recordingStr = "{";
        recordingStr += '"pitch": ' + recording[i].pitch + ',';
        recordingStr += '"roll": ' + recording[i].roll + ',';
        recordingStr += '"yaw": ' + recording[i].yaw + ',';
        recordingStr += '"vgx": ' + recording[i].vgx + ',';
        recordingStr += '"vgy": ' + recording[i].vgy + ',';
        recordingStr += '"vgz": ' + recording[i].vgz + ',';
        recordingStr += '"templ": ' + recording[i].templ + ',';
        recordingStr += '"temph": ' + recording[i].temph + ',';
        recordingStr += '"tof": ' + recording[i].tof + ',';
        recordingStr += '"h": ' + recording[i].h + ',';
        recordingStr += '"bat": ' + recording[i].bat + ',';
        recordingStr += '"baro": ' + recording[i].baro + ',';
        recordingStr += '"time": ' + recording[i].time + ',';
        recordingStr += '"agx": ' + recording[i].agx + ',';
        recordingStr += '"agy": ' + recording[i].agy + ',';
        recordingStr += '"agz": ' + recording[i].agz + ',';
        recordingStr += '"timech": ' + recording[i].timech + '}';
        recordingStringArr.push(recordingStr);

    }

    fs.writeFile(getLogFileName(Date.now()), "[" + recordingStringArr.join(',') + "]", function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        callback();
    });
}

function getState() {
    var split = new Buffer.from(stateString).toString().split(";");
    var now = Date.now();
    var timeChange = (now - time) / 1000;
    time = now;

    return {
        pitch:  Number(split[0].split(":")[1]),
        roll:   Number(split[1].split(":")[1]),
        yaw:    Number(split[2].split(":")[1]),
        vgx:    Number(split[3].split(":")[1]),
        vgy:    Number(split[4].split(":")[1]),
        vgz:    Number(split[5].split(":")[1]),
        templ:  Number(split[6].split(":")[1]),
        temph:  Number(split[7].split(":")[1]),
        tof:    Number(split[8].split(":")[1]),
        h:      Number(split[9].split(":")[1]),
        bat:    Number(split[10].split(":")[1]),
        baro:   Number(split[11].split(":")[1]),
        time:   Number(split[12].split(":")[1]),
        agx:    Number(split[13].split(":")[1]),
        agy:    Number(split[14].split(":")[1]),
        agz:    Number(split[15].split(":")[1]),
        timech: timeChange
    };
}

function getFileName(filename) {
    return './data/' + filename + '.json';
}

module.exports = {
    init: init,
    startRecording: function() {
        isRecording = true;
    },
    stopRecording: function() {
        isRecording = false;
    },
    resetRecording: function() {
        recording = [];
    },
    readFile: function(filename) {
        return JSON.parse(fs.readFileSync(getFileName(filename), 'utf8'));
    },
    recording: recording,
    saveRecording: saveData,
    getFileName: getFileName,
    currentState: function() {
        if (stateString) {
            return getState();
        }

        return {};
    },
    currentPosition: function() {
        return position;
    }
}