const stdio = require('stdio');
const mass = 0.080; // kilograms
const height = 43;
const width = 178;
const volume = width;
const cylinderLength = 59;
var commandedPosition = {
    x: 0,
    y: 0,
    z: 0
};
var commandedVelocity = Object.assign({}, commandedPosition);
var commandedAcceleration = Object.assign({}, commandedPosition);
var inertia = {
    x: (1.0/12.0) * (mass / 2.0) * (Math.pow(height, 2) + Math.pow(volume, 2)) + (1.0/12.0) * (mass / 4.0) * Math.pow(cylinderLength, 2),
    y: (1.0/12.0) * (mass / 2.0) * (Math.pow(width, 2) + Math.pow(volume, 2)) + (1.0/12.0) * (mass / 4.0) * Math.pow(cylinderLength, 2),
    z: (1.0/12.0) * (mass / 2.0) * (Math.pow(height, 2) + Math.pow(width, 2)) + (1.0/12.0) * (mass / 2.0) * Math.pow(cylinderLength, 2)
};

/**
 *
 * Interface methods
 * 
 */

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

function setCommandedValue(arg, callback, setCallback) {
    if (arg == undefined || is3DVector(arg)) {
        get3DVector(function(vector) {
            setCallback(vector);
            callback();
        });
    } else {
        setCallback(JSON.parse(arg));
        callback();
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
    setCommandedValue(arg, callback, function(value) {
        commandedPosition = value;
        console.log("Commanded Position : " + arg);
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
        commandedVelocity = value;
        console.log("Commanded Velocity : " + arg);
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
        commandedAcceleration = value;
        console.log("Commanded Acceleration : " + arg);
    });
}

module.exports = {
    mass: mass,
    commandedPosition: commandedPosition,
    commandedVelocity: commandedVelocity,
    commandedAcceleration: commandedAcceleration,
    inertia: inertia,
    setCommandedPosition: setCommandedPosition,
    setCommandedVelocity: setCommandedVelocity,
    setCommandedAcceleration: setCommandedAcceleration
}