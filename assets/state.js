
function getStateFromString(stateStr) {
    var split = new Buffer.from(stateStr).toString().split(";");
    var now = Date.now();
    var timeChange = (now - time) / 1000;
    time = now;

    return {
        pitch:  Number(split[0].split(":")[1]),
        roll:   Number(split[1].split(":")[1]),
        yaw:    Number(split[2].split(":")[1]),
        vgx:    Number(split[3].split(":")[1]),
        vgy:    Number(split[4].split(":")[1]),
        vgz:    Number(split[5].split(":")[1]),
        templ:  Number(split[6].split(":")[1]),
        temph:  Number(split[7].split(":")[1]),
        tof:    Number(split[8].split(":")[1]),
        h:      Number(split[9].split(":")[1]),
        bat:    Number(split[10].split(":")[1]),
        baro:   Number(split[11].split(":")[1]),
        time:   Number(split[12].split(":")[1]),
        agx:    Number(split[13].split(":")[1]),
        agy:    Number(split[14].split(":")[1]),
        agz:    Number(split[15].split(":")[1]),
        timech: timeChange
    };
}

function cleanState(state) {
    state.vgx = state.vgx * 10;
    state.vgy = state.vgy * 10;
    state.vgz = state.vgz * -10;
    state.agx = state.agx;
    state.agy = state.agy;
    state.agz = (state.agz + 989) * -1;

    return state;
}

function toString(state) {
    var stateStr = "{";
    stateStr += '"pitch": ' + state.pitch + ',';
    stateStr += '"roll": ' + state.roll + ',';
    stateStr += '"yaw": ' + state.yaw + ',';
    stateStr += '"vgx": ' + state.vgx + ',';
    stateStr += '"vgy": ' + state.vgy + ',';
    stateStr += '"vgz": ' + state.vgz + ',';
    stateStr += '"templ": ' + state.templ + ',';
    stateStr += '"temph": ' + state.temph + ',';
    stateStr += '"tof": ' + state.tof + ',';
    stateStr += '"h": ' + state.h + ',';
    stateStr += '"bat": ' + state.bat + ',';
    stateStr += '"baro": ' + state.baro + ',';
    stateStr += '"time": ' + state.time + ',';
    stateStr += '"agx": ' + state.agx + ',';
    stateStr += '"agy": ' + state.agy + ',';
    stateStr += '"agz": ' + state.agz + ',';
    stateStr += '"timech": ' + state.timech + '}';
    return stateStr;
}

module.exports = {
    fromString: getStateFromString,
    toString: 
    clean: cleanState,
};