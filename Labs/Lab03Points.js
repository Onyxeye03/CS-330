// JavaScript source code
function vec2(x, y) {
    return [x, y];
}

function vec2.fromValues(x, y) {
    return [x, y];
}

function vec4(x, y, z, w) {
    return [x, y, z, w];
}

function mat4.create() {
    return [1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1];
}