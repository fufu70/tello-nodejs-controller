/**
 * The Euler values are represented in mm scale.
 */

var position = {
    x: 0,
    y: 0,
    z: 0
}
var velocity = {
    x: 0,
    y: 0,
    z: 0
};
var acceleration = {
    x: 0,
    y: 0,
    z: 0
};

/** 
 * 
 * Position Functions
 * 
 */
function updatePositionFromState(state) {
    position.x = calculatePositionPoint({
        position: position.x,
        velocity: velocity.x,
        acceleration: state.agx,
        time: state.timech
    });
    position.y = calculatePositionPoint({
        position: position.y,
        velocity: velocity.y,
        acceleration: state.agy,
        time: state.timech
    });
    position.z = calculatePositionPoint({
        position: position.z,
        velocity: velocity.z,
        acceleration: state.agz,
        time: state.timech
    });
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
    velocity.x = calculateVelocityPoint({
        velocity: velocity.x,
        acceleration: state.agx,
        time: state.timech
    });
    velocity.y = calculateVelocityPoint({
        velocity: velocity.y,
        acceleration: state.agy,
        time: state.timech
    });
    velocity.z = calculateVelocityPoint({
        velocity: velocity.z,
        acceleration: state.agz,
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
    acceleration.x = state.agx;
    acceleration.y = state.agy;
    acceleration.z = state.agz;
}

module.exports = {
    position: position,
    velocity: velocity,
    acceleration: acceleration,
    update: function(state) {
        updateAccelerationFromState(state);
        updateVelocityFromState(state);
        updatePositionFromState(state);
    }
}