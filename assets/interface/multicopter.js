const stdio = require('stdio');
const multicopter = require('./../multicopter.js');

/**
 * Gets the xyz value and sends it back to the callback function as a object.
 * 
 * @param  {Function} callback To call once all user information is gathered.
 *                             Passes a object: {x: 0, y: 0, z: 0}
 */
function get3DVector(callback) {
    stdio.question('X', function (err, x) {
        stdio.question('Y', function (err, y) {
            stdio.question('Z', function (err, z) {
                callback({
                    x: parseInt(x),
                    y: parseInt(y),
                    z: parseInt(z)
                });
            });
        });
    });
}

/**
 * Checks that the string provided is a 3D vector. The expected string is of format:
 * "{x:1.0,y:1.0,z:1.0}"
 * It should not contain any spaces.
 * 
 * @param  {string} str The string to match
 * @return {boolean}    True if the the string is a 3D vector.
 */
function is3DVector(str) {
    try {
        var vector = JSON.parse(str);
        return typeof(vector.x) == 'number' 
            && typeof(vector.y) == 'number' 
            && typeof(vector.z) == 'number';
    } catch(err) {
        return false;
    }
}

function setCommandedValue(arg, callback) {
    if (arg == undefined || !is3DVector(arg)) {
        get3DVector(function(vector) {
            callback(vector);
        });
    } else {
        callback(JSON.parse(arg));
    }
}

/**
 * Sets the commanded position of the multicopter from the provided
 * 3D vector.
 * 
 * @param  {string}   arg      3D vector.
 * @param  {Function} callback Called after the position is set.
 */
function setCommandedPosition(arg, callback) {
    setCommandedValue(arg, function(value) {
        multicopter.commandedPosition = value;
        console.log("Commanded Position : " + JSON.stringify(multicopter.commandedPosition));
        callback();
    });
}

/**
 * Sets the commanded velocity of the multicopter from the provided
 * 3D vector.
 * 
 * @param  {string}   arg      3D vector.
 * @param  {Function} callback Called after the velocity is set.
 */
function setCommandedVelocity(arg, callback) {
    setCommandedValue(arg, callback, function(value) {
        multicopter.commandedVelocity = value;
        console.log("Commanded Velocity : " + value);
    });
}

/**
 * Set the commanded acceleration of the multicopter.
 * 
 * @param  {string}   arg      3D vector.
 * @param  {Function} callback Called after the velocity is set.
 */
function setCommandedAcceleration(arg, callback) {
    setCommandedValue(arg, callback, function(value) {
        multicopter.commandedAcceleration = value;
        console.log("Commanded Acceleration : " + value);
    });
}

module.exports ={
    setCommandedPosition: setCommandedPosition,
    setCommandedVelocity: setCommandedVelocity,
    setCommandedAcceleration: setCommandedAcceleration
}