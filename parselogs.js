var fs = require('fs');
var file = "./logs/up_200_1537726575275.json";

function calculatePositionThroughTime(log) {
    var positions = [];
    var currentPosition = {
        x: 0,
        y: 0,
        z: 0
    };
    positions.push(currentPosition);

    function getPosition(index) {
        // return {
        //     x: currentPosition.x + (0.5 * (log[index].vgx + log[index - 1].vgx) * log[index].timech),
        //     y: currentPosition.y + (0.5 * (log[index].vgy + log[index - 1].vgy) * log[index].timech),
        //     z: currentPosition.z + (0.5 * (log[index].vgz + log[index - 1].vgz) * log[index].timech),
        // };
        return {
            x: currentPosition.x + (log[index].vgx * log[index].timech) - (0.5 * log[index].agx * Math.pow(log[index].timech, 2)),
            y: currentPosition.y + (log[index].vgy * log[index].timech) - (0.5 * log[index].agy * Math.pow(log[index].timech, 2)),
            z: currentPosition.z + (log[index].vgz * log[index].timech) - (0.5 * log[index].agz * Math.pow(log[index].timech, 2)),
        };
        // return {
        //     x: currentPosition.x + (log[index].vgx * log[index].timech),
        //     y: currentPosition.y + (log[index].vgy * log[index].timech),
        //     z: currentPosition.z + (log[index].vgz * log[index].timech),
        // };
    }

    function cleanLogInstance(index) {
        log[index].vgx = log[index].vgx / 100;
        log[index].vgy = log[index].vgy / 100;
        log[index].vgz = log[index].vgz / 100;
        log[index].agx = log[index].agx / 100;
        log[index].agy = log[index].agy / 100;
        log[index].agz = (log[index].agz / 100);
    }

    cleanLogInstance(0);

    for (var i = 1; i < log.length; i ++) {
        cleanLogInstance(i);
        var newPosition = getPosition(i);
        positions.push(newPosition);
        currentPosition = newPosition;
        console.log(log[i].agz);
    }

    return positions;
}

function getMaxHeight(positions) {
    var maxHeight = positions[0].z;
    for (var i = 1; i < positions.length; i ++) {
        // console.log(positions[i].z);
        if (maxHeight < positions[i].z) {
            maxHeight = positions[i].z;
        }
    }

    return maxHeight;
}

exportToCSV(JSON.parse(fs.readFileSync(file, 'utf8')), 'up_200_1537726575275');
// console.log(estimatedPositions[0]);
// console.log(estimatedPositions[estimatedPositions.length - 1]);
// console.log(getMaxHeight(estimatedPositions));

