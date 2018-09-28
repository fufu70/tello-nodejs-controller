var fs = require('fs');
var state = require('./state.js')
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

function saveData(prependToFilename, callback) {

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

    fs.writeFile(getFileName(prependToFilename + Date.now()), "[" + recordingStringArr.join(',') + "]", function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        callback();
    });
}

function getState() {
    return state.clean(state.fromString(stateString));
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