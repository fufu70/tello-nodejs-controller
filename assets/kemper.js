const localMathLib = require('./math.js');
const multicopter = require('./multicopter.js');
const euler = require('./euler.js');

const DEFAULT_VALUE = 0.0;
const MAXIMUM_LATT_COMM_ACCELERATION = 50.0;
const MAXIMUM_Z_COMM_ACCELERATION = 70.0;
const MINIMUM_Z_COMM_ACCELERATION = 8.0;
const THRUST_DIVISION = 1.0;
const LATT_DIVISION = 0.7;
const DRAG_COEFFICIENT = 1.0;
const SPEED_MULTIPLIER = 1.0;
const ANGLE_DIVISOR = 10.0;
const LINEAR_PROPORTIONAL = { x: .73, y: .73, z: 1.00};
const LINEAR_DERIVATIVE_VELOCITY = { x: 2.50, y: 3.50, z: 2.00};
const LINEAR_DERIVATIVE_ACCELERATION = { x: 0.0, y: 0.0, z: 0.0};
const LINEAR_INTEGRAL = { x: 0.0, y: 0.0, z: 0.0};
const ANGULAR_PROPORTIONAL = { phi: 1.50, theta: 1.50, psi: 0.5};
const ANGULAR_DERIVTIVE = { phi: 5.00, theta: 5.00, psi: .50};
const ANGULAR_INTEGRAL = { phi: 0.0, theta: 0.0, psi: 0.0};
const GRAVITY = { x: 0.0, y: 0.0, z: -9.81};
var linearCommandedPosition = {
    x: 0,
    y: 0,
    z: 0
};
var linearCommandedVelocity = Object.assign({}, linearCommandedPosition);
var linearCommandedAccelerations = Object.assign({}, linearCommandedPosition);
var angularCommandedAccelerations = {
    phi: 0,
    theta: 0,
    psi: 0
};
var angularCommandedVelocity = Object.assign({}, angularCommandedAccelerations);
var angularCommandedTao = Object.assign({}, angularCommandedAccelerations);
var integralLinearError = Object.assign({}, linearCommandedPosition);
var integralAngularError = Object.assign({}, angularCommandedAccelerations);
var thetaCommandedPosition = 0;
var phiCommandedPosition = 0;
var thrustCommand = 0;
var psiCommandedPosition = 0;
var phiCommandedPositionPrevious = 0;
var thetaCommandedPositionPrevious = 0;
var psiCommandedPositionPrevious = 0;

function setSuggestedControl(time) {
    calculateIntegralError(time);
    calculateLinearCommandedAcceleration();
    calculateAngularCommandedPosition();
    calculateAngularCommandedVelocity(time);
    calculateAngularCommandedTao();

    phiCommandedPositionPrevious = phiCommandedPosition;
    thetaCommandedPositionPrevious = thetaCommandedPosition;
    psiCommandedPositionPrevious = psiCommandedPosition;
}

function calculateIntegralError(time) {
    
    integralLinearError.x = integralLinearError.x + ((multicopter.commandedPosition.x - euler.linearPosition.x) * time);
    integralLinearError.y = integralLinearError.y + ((multicopter.commandedPosition.y - euler.linearPosition.y) * time);
    integralLinearError.z = integralLinearError.z + ((multicopter.commandedPosition.z - euler.linearPosition.z) * time);

    integralAngularError.phi = integralAngularError.phi + ((phiCommandedPosition - euler.angularPosition.phi) * time);
    integralAngularError.theta = integralAngularError.theta + ((thetaCommandedPosition - euler.angularPosition.theta) * time);
    integralAngularError.psi = integralAngularError.psi + ((psiCommandedPosition - euler.angularPosition.psi) * time);
}

function calculateLinearCommandedAcceleration() {

    var xCommandedAcc = LINEAR_PROPORTIONAL.x * (multicopter.commandedPosition.x - euler.linearPosition.x);
    xCommandedAcc += LINEAR_DERIVATIVE_VELOCITY.x * (multicopter.commandedVelocity.x - euler.linearVelocity.x);
    xCommandedAcc += LINEAR_DERIVATIVE_ACCELERATION.x * (multicopter.commandedAcceleration.x - euler.linearAcceleration.x);
    xCommandedAcc += LINEAR_INTEGRAL.x * integralLinearError.x;

    var yCommandedAcc = LINEAR_PROPORTIONAL.y * (multicopter.commandedPosition.y - euler.linearPosition.y);
    yCommandedAcc += LINEAR_DERIVATIVE_VELOCITY.y * (multicopter.commandedVelocity.y - euler.linearVelocity.y);
    yCommandedAcc += LINEAR_DERIVATIVE_ACCELERATION.y * (multicopter.commandedAcceleration.y - euler.linearAcceleration.y);
    yCommandedAcc += LINEAR_INTEGRAL.y * integralLinearError.y;

    var zCommandedAcc = LINEAR_PROPORTIONAL.z * (multicopter.commandedPosition.z - euler.linearPosition.z);
    zCommandedAcc += LINEAR_DERIVATIVE_VELOCITY.z * (multicopter.commandedVelocity.z - euler.linearVelocity.z);
    zCommandedAcc += LINEAR_DERIVATIVE_ACCELERATION.z * (multicopter.commandedAcceleration.z - euler.linearAcceleration.z);
    zCommandedAcc += LINEAR_INTEGRAL.z * integralLinearError.z;

    linearCommandedAccelerations.x = xCommandedAcc;
    linearCommandedAccelerations.y = yCommandedAcc;
    linearCommandedAccelerations.z = zCommandedAcc;
}

function calculateAngularCommandedPosition() {
    var desiredThetaAngle = linearCommandedAccelerations.y * Math.cos(euler.angularPosition.psi);
    desiredThetaAngle += linearCommandedAccelerations.x * Math.sin(euler.angularPosition.psi);
    desiredThetaAngle = desiredThetaAngle / ANGLE_DIVISOR;
    var thetaCommandNumerator = Math.sign(desiredThetaAngle) * Math.sin(localMathLib.toRadians(Math.abs(desiredThetaAngle)));
    thetaCommandedPosition = thetaCommandNumerator;


    var desiredPhiAngle = linearCommandedAccelerations.x * Math.cos(euler.angularPosition.psi);
    desiredPhiAngle += linearCommandedAccelerations.y * Math.sin(euler.angularPosition.psi);
    desiredPhiAngle = desiredPhiAngle / ANGLE_DIVISOR;
    var phiCommandNumerator = Math.sign(desiredPhiAngle) * Math.sin(localMathLib.toRadians(Math.abs(desiredPhiAngle)));
    phiCommandedPosition = phiCommandNumerator;

    var thrustComm = linearCommandedAccelerations.x * (
        (Math.sin(euler.angularPosition.theta) * Math.cos(euler.angularPosition.psi) * Math.cos(euler.angularPosition.phi))
                            + (Math.sin(euler.angularPosition.psi * Math.sin(euler.angularPosition.phi))));
    thrustComm += linearCommandedAccelerations.y * ((Math.sin(euler.angularPosition.theta)
                        * Math.sin(euler.angularPosition.psi) * Math.cos(euler.angularPosition.phi))
                    - (Math.cos(euler.angularPosition.psi * Math.sin(euler.angularPosition.phi))));
    thrustComm += (linearCommandedAccelerations.z + GRAVITY.z)
                    * (Math.cos(euler.angularPosition.theta)
                            * Math.cos(euler.angularPosition.phi));    
    thrustCommand = multicopter.mass * thrustComm;

    psiCommandedPosition = 0;
}

function calculateAngularCommandedVelocity(time) {
    angularCommandedVelocity.phi = (phiCommandedPosition - phiCommandedPositionPrevious) / time;
    angularCommandedVelocity.theta = (thetaCommandedPosition - thetaCommandedPositionPrevious) / time;
    angularCommandedVelocity.psi = (psiCommandedPosition - psiCommandedPositionPrevious) / time;
}

function calculateAngularCommandedTao() {

    var phiTaoCommanded = ANGULAR_PROPORTIONAL.phi * (angularCommandedVelocity.phi - euler.angularPosition.phi);
    phiTaoCommanded += ANGULAR_DERIVTIVE.phi * (angularCommandedVelocity.phi - euler.angularVelocity.phi);

    var thetaTaoCommanded = ANGULAR_PROPORTIONAL.theta * (angularCommandedVelocity.theta - euler.angularPosition.theta);
    thetaTaoCommanded += ANGULAR_DERIVTIVE.theta * (angularCommandedVelocity.theta - euler.angularVelocity.theta);
                        
    var psiTaoCommanded = ANGULAR_PROPORTIONAL.psi * (angularCommandedVelocity.psi - euler.angularPosition.psi);
    psiTaoCommanded += ANGULAR_DERIVTIVE.psi * (angularCommandedVelocity.psi - euler.angularVelocity.psi);
    
    angularCommandedTao.phi = phiTaoCommanded * multicopter.inertia.x;
    angularCommandedTao.theta = thetaTaoCommanded * multicopter.inertia.y;
    angularCommandedTao.psi = psiTaoCommanded * multicopter.inertia.z;
}

module.exports = {
    update: function(time) {
        setSuggestedControl(time);
    },
    thrustCommand: thrustCommand,
    phiCommand: angularCommandedTao.phi,
    thetaCommand: angularCommandedTao.theta,
    psiCommand: angularCommandedTao.psi,
    getState: function() {
        return {
            thrustCommand: thrustCommand,
            phiCommand: angularCommandedTao.phi,
            thetaCommand: angularCommandedTao.theta,
            psiCommand: angularCommandedTao.psi,
            thetaCommandedPosition: thetaCommandedPosition,
            phiCommandedPosition: phiCommandedPosition,
            integralLinearError_x: integralLinearError.x,
            integralLinearError_y: integralLinearError.y,
            integralLinearError_z: integralLinearError.z,
            integralAngularError_phi: integralAngularError.phi,
            integralAngularError_theta: integralAngularError.theta,
            integralAngularError_psi: integralAngularError.psi,
            linearCommandedAccelerations_x: linearCommandedAccelerations.x,
            linearCommandedAccelerations_y: linearCommandedAccelerations.y,
            linearCommandedAccelerations_z: linearCommandedAccelerations.z,
            angularCommandedVelocity_phi: angularCommandedVelocity.phi,
            angularCommandedVelocity_theta: angularCommandedVelocity.theta,
            angularCommandedVelocity_psi: angularCommandedVelocity.psi,
        };
    }
};