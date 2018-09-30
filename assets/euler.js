/**
 * The Euler values are represented in mm scale.
 */

var linearPosition = {
    x: 0,
    y: 0,
    z: 0
};
var angularPosition = {
    phi: 0,
    theta: 0,
    psi: 0
};
var linearVelocity = Object.assign({}, linearPosition);
var angularVelocity = Object.assign({}, angularPosition);
var linearAcceleration = Object.assign({}, linearPosition);
var motion = {
    px: 0,
    py: 0,
    pz: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    ax: 0,
    ay: 0,
    az: 0,
    pphi: 0,
    ptheta: 0,
    ppsi: 0,
    vphi: 0,
    vtheta: 0,
    vpsi: 0,
};

/** 
 * 
 * Position Functions
 * 
 */
function updatePositionFromState(state) {
    linearPosition.x = calculatePositionPoint({
        position: linearPosition.x,
        velocity: state.vgx,
        previousVelocity: linearVelocity.x,
        acceleration: linearAcceleration.x,
        time: state.timech
    });
    linearPosition.y = calculatePositionPoint({
        position: linearPosition.y,
        velocity: state.vgy,
        previousVelocity: linearVelocity.y,
        acceleration: linearAcceleration.y,
        time: state.timech
    });
    linearPosition.z = calculatePositionPoint({
        position: linearPosition.z,
        velocity: state.vgz,
        previousVelocity: linearVelocity.z,
        acceleration: linearAcceleration.z,
        time: state.timech
    });

    angularPosition.phi = state.pitch;
    angularPosition.theta = state.roll;
    angularPosition.psi = state.yaw;
}

function calculatePositionPoint(motion) {
    return motion.position + (0.5 * (motion.velocity - motion.previousVelocity) * motion.time * motion.time);
    // return motion.position + (motion.velocity * motion.time) - (0.5 * motion.acceleration * motion.time * motion.time);
}

/** 
 * 
 * Velocity Functions
 * 
 */

function updateVelocityFromState(state) {
    // linearVelocity.x = calculateVelocityPoint({
    //     velocity: linearVelocity.x,
    //     acceleration: linearAcceleration.x,
    //     time: state.timech
    // });
    // linearVelocity.y = calculateVelocityPoint({
    //     velocity: linearVelocity.y,
    //     acceleration: linearAcceleration.y,
    //     time: state.timech
    // });
    // linearVelocity.z = calculateVelocityPoint({
    //     velocity: linearVelocity.z,
    //     acceleration: linearAcceleration.z,
    //     time: state.timech
    // });
    linearVelocity.x = state.vgx;
    linearVelocity.y = state.vgy;
    linearVelocity.z = state.vgz;

    angularVelocity.phi = (state.pitch - angularPosition.phi) / state.timech;
    angularVelocity.theta = (state.roll - angularPosition.theta) / state.timech;
    angularVelocity.psi = (state.yaw - angularPosition.psi) / state.timech;
}

function calculateVelocityPoint(motion) {
    return (motion.acceleration * motion.time) + motion.velocity;
}

/**
 * 
 * Acceleration Functions
 * 
 */

function updateAccelerationFromState(state) {
    linearAcceleration.x = state.agx;
    linearAcceleration.y = state.agy;
    linearAcceleration.z = state.agz;
}

module.exports = {
    linearPosition: linearPosition,
    linearVelocity: linearVelocity,
    linearAcceleration: linearAcceleration,
    angularPosition: angularPosition,
    angularVelocity: angularVelocity,
    update: function(state) {
        updatePositionFromState(state);
        updateVelocityFromState(state);
        updateAccelerationFromState(state);

        motion.px = linearPosition.x;
        motion.py = linearPosition.y;
        motion.pz = linearPosition.z;
        motion.vx = linearVelocity.x;
        motion.vy = linearVelocity.y;
        motion.vz = linearVelocity.z;
        motion.ax = linearAcceleration.x;
        motion.ay = linearAcceleration.y;
        motion.az = linearAcceleration.z;
        motion.pphi = angularPosition.phi;
        motion.ptheta = angularPosition.theta;
        motion.ppsi = angularPosition.psi;
        motion.vphi = angularVelocity.phi;
        motion.vtheta = angularVelocity.theta;
        motion.vpsi = angularVelocity.psi;
    },
    motion: motion
}