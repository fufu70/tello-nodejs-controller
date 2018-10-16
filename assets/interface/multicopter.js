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

/**
 * Sets the xyz values of the provided reference and then calls the
 * callback function.
 * 
 * @param {string}   arg       Argument provided by the user
 * @param {Object}   reference An object with xyz values
 * @param {Function} callback  The function to callback on completion.
 */
function setCommandedValue(arg, reference, callback) {

    function setReference(vector) {
        reference.x = vector.x;
        reference.y = vector.y;
        reference.z = vector.z;
        callback(vector);
    }

    if (arg == undefined || !is3DVector(arg)) {
        get3DVector(setReference);
    } else {
        setReference(JSON.parse(arg));
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
    setCommandedValue(arg, multicopter.commandedPosition, function(value) {
        console.log("Set Commanded Position : " + JSON.stringify(value));
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
    setCommandedValue(arg, multicopter.commandedVelocity, function(value) {
        console.log("Set Commanded Velocity : " + JSON.stringify(value));
        callback();
    });
}

/**
 * Set the commanded acceleration of the multicopter.
 * 
 * @param  {string}   arg      3D vector.
 * @param  {Function} callback Called after the velocity is set.
 */
function setCommandedAcceleration(arg, callback) {
    setCommandedValue(arg, multicopter.commandedAcceleration, function(value) {
        console.log("Set Commanded Acceleration : " + JSON.stringify(value));
        callback();
    });
}

module.exports ={
    setCommandedPosition: setCommandedPosition,
    setCommandedVelocity: setCommandedVelocity,
    setCommandedAcceleration: setCommandedAcceleration
}