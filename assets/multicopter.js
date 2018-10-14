const mass = 0.080; // kilograms
const height = 43;
const width = 178;
const volume = width;
const cylinderLength = 59;
var commandedPosition = {
    x: 0,
    y: 0,
    z: 0
};
var commandedVelocity = Object.assign({}, commandedPosition);
var commandedAcceleration = Object.assign({}, commandedPosition);
var inertia = {
    x: (1.0/12.0) * (mass / 2.0) * (Math.pow(height, 2) + Math.pow(volume, 2)) + (1.0/12.0) * (mass / 4.0) * Math.pow(cylinderLength, 2),
    y: (1.0/12.0) * (mass / 2.0) * (Math.pow(width, 2) + Math.pow(volume, 2)) + (1.0/12.0) * (mass / 4.0) * Math.pow(cylinderLength, 2),
    z: (1.0/12.0) * (mass / 2.0) * (Math.pow(height, 2) + Math.pow(width, 2)) + (1.0/12.0) * (mass / 2.0) * Math.pow(cylinderLength, 2)
};

module.exports = {
    mass: mass,
    commandedPosition: commandedPosition,
    commandedVelocity: commandedVelocity,
    commandedAcceleration: commandedAcceleration,
    inertia: inertia,
}