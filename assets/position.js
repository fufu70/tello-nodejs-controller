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
    position.x = calculateVelocityPoint({
        velocity: velocity.x,
        acceleration: state.agx,
        time: state.timech
    });
    position.y = calculateVelocityPoint({
        velocity: velocity.y,
        acceleration: state.agy,
        time: state.timech
    });
    position.z = calculateVelocityPoint({
        velocity: velocity.z,
        acceleration: state.agz,
        time: state.timech
    });
}

function calculateVelocityPoint(motion) {
    return (motion.acceleration * motion.time) + motion.velocity;
}

module.exports = {
    position: position,
    updatePosition: function(state) {
        updateVelocityFromState(state);
        updatePositionFromState(state);
    }
}