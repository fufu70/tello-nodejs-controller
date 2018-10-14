const stdio = require('stdio');
const data = require('./../data.js');

/**
 * Outputs the current state of the tello
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function state(arg, callback) {
    console.log(data.currentState());
    callback();
}

/**
 * Outputs the current position of the tello
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function position(arg, callback) {
    console.log(data.currentPosition());
    callback();
}

/**
 * Starts recording the tello's data stream.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function start(arg, callback) {
    data.startRecording();
    callback();
}

/**
 * Stops recording the tello's data stream.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function stop(arg, callback) {
    data.stopRecording();
    callback();
}

/**
 * Clears the tello's data stream collected.
 * 
 * @param  {string}   arg      Ignored
 * @param  {Function} callback Called after the action is complete
 */
function reset(arg, callback) {
    data.resetRecording();
    callback();
}

/**
 * Saves the tello's collected data stream. Stores the stream as a JSON
 * into the provided file. The file is stored in the "data" directory.
 * 
 * @param  {string}   filename The filename to save to.
 * @param  {Function} callback Called after the action is complete
 */
function save(filename, callback) {
    if (filename == undefined) {
        data.saveRecording("", callback);
    } else {
        data.saveRecording(filename, callback);
    }
}

module.exports = {
    state: state,
    position: position,
    start: start,
    stop: stop,
    reset: reset,
    save: save,
};