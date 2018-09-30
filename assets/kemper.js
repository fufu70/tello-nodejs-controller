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

var multicopter = ('./multicopter.js');
var euler = require('./euler.js');
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
    calculateAngularCommandedVelocity();
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
    var thetaCommandNumerator = Math.signum(desiredThetaAngle) * Math.sin(Math.toRadians(Math.abs(desiredThetaAngle)));
    thetaCommandedPosition = thetaCommandNumerator;


    var desiredPhiAngle = linearCommandedAccelerations.x * Math.cos(euler.angularPosition.psi);
    desiredPhiAngle += linearCommandedAccelerations.y * Math.sin(euler.angularPosition.psi);
    desiredPhiAngle = desiredPhiAngle / ANGLE_DIVISOR;
    var phiCommandNumerator = Math.signum(desiredPhiAngle) * Math.sin(Math.toRadians(Math.abs(desiredPhiAngle)));
    phiCommandedPosition = phiCommandNumerator;

    var thrustComm = linearCommandedAccelerations.x * (
        (Math.sin(euler.angularPosition.theta) * Math.cos(euler.angularPosition.psi) * Math.cos(euler.angularPosition.phi))
                            + (Math.sin(euler.angularPosition.psi * Math.sin(euler.angularPosition.phi))));
    thrustComm += linearCommandedAccelerations.y * ((Math.sin(euler.angularPosition.theta)
                        * Math.sin(euler.angularPosition.psi) * Math.cos(euler.angularPosition.phi))
                    - (Math.cos(euler.angularPosition.psi * Math.sin(euler.angularPosition.phi))));
    thrustComm += (linearCommandedAccelerations.z + Acceleration.GRAVITY[Environment.VALUE_Z])
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

    double phiTaoCommanded = ANGULAR_PROPORTIONAL.phi * (angularCommandedVelocity.phi - euler.angularPosition.phi);
    phiTaoCommanded += ANGULAR_DERIVTIVE.phi * (angularCommandedVelocity.phi - euler.angularVelocity.phi);

    double thetaTaoCommanded = ANGULAR_PROPORTIONAL.theta * (angularCommandedVelocity.theta - euler.angularPosition.theta);
    thetaTaoCommanded += ANGULAR_DERIVTIVE.theta * (angularCommandedVelocity.theta - euler.angularVelocity.theta);
                        
    double psiTaoCommanded = ANGULAR_PROPORTIONAL.psi * (angularCommandedVelocity.psi - euler.angularPosition.psi);
    psiTaoCommanded += ANGULAR_DERIVTIVE.psi * (angularCommandedVelocity.psi - euler.angularVelocity.psi);
    
    angularCommandedTao.phi = phiTaoCommanded * multicopter.inertia.x;
    angularCommandedTao.theta = thetaTaoCommanded * multicopter.inertia.y;
    angularCommandedTao.psi = psiTaoCommanded * multicopter.inertia.z;
}

module.exports = {
    update: function(time) {
        setSuggestedControl(time);
    }
};