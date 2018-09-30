const DEFAULT_VALUE = 0.0;
const MAXIMUM_LATT_COMM_ACCELERATION = 50.0;
const MAXIMUM_Z_COMM_ACCELERATION = 70.0;
const MINIMUM_Z_COMM_ACCELERATION = 8.0;
const THRUST_DIVISION = 1.0;
const LATT_DIVISION = 0.7;
const DRAG_COEFFICIENT = 1.0;
const SPEED_MULTIPLIER = 1.0;
const ANGLE_DIVISOR = 10.0;
const LINEAR_PROPORTIONAL = { x: 7.3, y: 7.3, z: 10.0};
const LINEAR_DERIVATIVE_VELOCITY = { x: 25.0, y: 35.0, z: 20.0};
const LINEAR_DERIVATIVE_ACCELERATION = { x: 0.0, y: 0.0, z: 0.0};
const LINEAR_INTEGRAL = { x: 0.0, y: 0.0, z: 3.0};
const ANGULAR_PROPORTIONAL = { x: 15.0, y: 15.0, z: 0.5};
const ANGULAR_DERIVTIVE = { x: 50.0, y: 50.0, z: 5.0};
const ANGULAR_INTEGRAL = { x: 0.0, y: 0.0, z: 0.0};

var euler = require('./euler.js');
var linearCommandedPosition = {
    x: 0,
    y: 0,
    z: 0
};
var angularCommandedPosition = {
    phi: 0,
    theta: 0,
    psi: 0
};
var linearCommandedAccelerations = Object.assign({}, linearCommandedPosition);
var angularCommandedAccelerations = Object.assign({}, angularCommandedPosition);
var angularCommandedTao = Object.assign({}, angularCommandedPosition);
var integralLinearError = Object.assign({}, linearCommandedPosition);
var integralAngularError = Object.assign({}, angularCommandedPosition);

function setSuggestedControl(double time) {
    calculateIntegralError(time);
    calculateLinearCommandedAcceleration();
    calculateAngularCommandedPosition();
    calculateAngularCommandedVelocity();
    calculateAngularCommandedTao();
}

function calculateIntegralError(double time) {
    integralLinearError.x = integralLinearError.x + ((linearCommandedPosition.x - euler.linearPosition.x) * time);
    integralLinearError.y = integralLinearError.y + ((linearCommandedPosition.y - euler.linearPosition.y) * time);
    integralLinearError.z = integralLinearError.z + ((linearCommandedPosition.z - euler.linearPosition.z) * time);

    integralAngularError.phi = integralAngularError.phi + ((angularCommandedPosition.phi - euler.angularPosition.phi) * time);
    integralAngularError.theta = integralAngularError.theta + ((angularCommandedPosition.phi - euler.angularPosition.theta) * time);
    integralAngularError.psi = integralAngularError.psi + ((angularCommandedPosition.phi - euler.angularPosition.psi) * time);
}

function calculateLinearCommandedAcceleration() {
    
}

function calculateAngularCommandedPosition() {}
function calculateAngularCommandedVelocity(double time) {}
function calculateAngularCommandedTao() {}

module.exports = {
    init: function(position) {
        linearCommandedPosition = position;
    }
};