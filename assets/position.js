var position = {
    x: 0,
    y: 0,
    z: 0
}

function updatePreviousPosition() {
    previousPosition = Object.assign({}, position);
}

function updatePositionFromState(state) {
    position.x = calculatePositionPoint({
        position: position.x, 
        velocity: state.vgx,
        acceleration: state.agx,
        time: state.timech
    });
    position.y = calculatePositionPoint({
        position: position.y, 
        velocity: state.vgy,
        acceleration: state.agy,
        time: state.timech
    });
    position.z = calculatePositionPoint({
        position: position.z, 
        velocity: state.vgz,
        acceleration: state.agz,
        time: state.timech
    });
}

function calculatePositionPoint(motion) {
    return motion.position + (motion.velocity * motion.time) - (0.5 * motion.acceleration * motion.time * motion.time);
}

module.exports = {
    position: position,
    updatePosition: updatePositionFromState
}