var fs = require('fs');
var state = require('./state.js');
var euler = require('./euler.js');
var PORT_READ = 8890;
var HOST = '0.0.0.0';
var stateString = undefined;
var isListening = false;
var isRecording = false;
var recording = [];
var lastFileSaved = "";

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

function saveData(data, prependToFilename, callback) {

    var dataStringArr = [];

    for (var i = 0; i < data.length; i ++) {
        dataStringArr.push(JSON.stringify(data[i]));
    }
    var fileName = prependToFilename + Date.now();

    fs.writeFile(getFileName(fileName), "[" + dataStringArr.join(',') + "]", function(err) {
        if(err) {
            return console.log(err);
        }
        lastFileSaved = fileName;
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
    saveRecording: function(prependToFilename, callback) {
        saveData(recording, prependToFilename, callback);
    },
    saveData: saveData,
    getFileName: getFileName,
    getLastFileSaved: function() {
        return lastFileSaved;
    },
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