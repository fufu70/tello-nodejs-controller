var fs = require('fs');
var state = require('./state.js');
var euler = require('./euler.js');
var PORT_READ = 8890;
var HOST = '0.0.0.0';
var stateString = undefined;
var isListening = false;
var isRecording = false;
var recording = [];

function init(callback) {

    var dgram = require('dgram');
    var server = dgram.createSocket('udp4');

    server.on('listening', function () {});
    server.on('message', function (message, remote) {
        stateString = message;

        if (!isListening) {
            isListening = true;
            state.init();
            callback();
        } else if (isRecording) {
            recordData();
        }
    });

    server.bind(PORT_READ, HOST);
}

function recordData() {
    var state = getState();
    euler.update(state);
    recording.push(Object.assign(state, euler.motion));
}

function saveData(prependToFilename, callback) {

    var recordingStringArr = [];

    for (var i = 0; i < recording.length; i ++) {
        recordingStringArr.push(JSON.stringify(recording[i]));

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
    return './data/' + filename.replace(".json", "") + '.json';
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
        return euler.linearPosition;
    }
}