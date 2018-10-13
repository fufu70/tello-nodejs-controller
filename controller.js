var commander = require('./assets/commander.js');

/**
 * Read Input or request input
 */

if (process.argv[2] !== undefined && typeof(process.argv[2]) == "string" && process.argv[2].indexOf("read") == 0) {
    commander.send(process.argv[2]);
} else {
    commander.init();
}