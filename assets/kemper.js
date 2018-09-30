const LINEAR_PROPORTIONAL = { x: 7.3, y: 7.3, z: 10.0};
const LINEAR_DERIVATIVE_VELOCITY = { x: 25.0, y: 35.0, z: 20.0};
const LINEAR_DERIVATIVE_ACCELERATION = { x: 0.0, y: 0.0, z: 0.0};
const LINEAR_INTEGRAL = { x: 0.0, y: 0.0, z: 3.0};
const ANGULAR_PROPORTIONAL = { x: 15.0, y: 15.0, z: 0.5};
const ANGULAR_DERIVTIVE = { x: 50.0, y: 50.0, z: 5.0};
const ANGULAR_INTEGRAL = { x: 0.0, y: 0.0, z: 0.0};

var euler = require('./euler.js');
var linearCommandedAccelerations = {
    x: 0,
    y: 0,
    z: 0
};

module.exports = {
    init: function() {
        
    }
};