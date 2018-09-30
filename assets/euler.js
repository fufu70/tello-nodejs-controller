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
var linearAcceleration = Object.assign({}, linearPosition);

/** 
 * 
 * Position Functions
 * 
 */
function updatePositionFromState(state) {
    linearPosition.x = calculatePositionPoint({
        position: linearPosition.x,
        velocity: linearVelocity.x,
        acceleration: linearAcceleration.x,
        time: state.timech
    });
    linearPosition.y = calculatePositionPoint({
        position: linearPosition.y,
        velocity: linearVelocity.y,
        acceleration: linearAcceleration.y,
        time: state.timech
    });
    linearPosition.z = calculatePositionPoint({
        position: linearPosition.z,
        velocity: linearVelocity.z,
        acceleration: linearAcceleration.z,
        time: state.timech
    });
    
    angularPosition.phi = state.pitch;
    angularPosition.theta = state.roll;
    angularPosition.psi = state.yaw;
}

function calculatePositionPoint(motion) {
    return motion.position + (motion.velocity * motion.time) - (0.5 * motion.acceleration * motion.time * motion.time);
}

/** 
 * 
 * Velocity Functions
 * 
 */

function updateVelocityFromState(state) {
    linearVelocity.x = calculateVelocityPoint({
        velocity: linearVelocity.x,
        acceleration: linearAcceleration.x,
        time: state.timech
    });
    linearVelocity.y = calculateVelocityPoint({
        velocity: linearVelocity.y,
        acceleration: linearAcceleration.y,
        time: state.timech
    });
    linearVelocity.z = calculateVelocityPoint({
        velocity: linearVelocity.z,
        acceleration: linearAcceleration.z,
        time: state.timech
    });
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
    update: function(state) {
        updateAccelerationFromState(state);
        updateVelocityFromState(state);
        updatePositionFromState(state);
    }
}