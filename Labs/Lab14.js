"use strict";

var canvas;
var gl;

var near = 0.3;
var far = 3.75;
var radius = 4.0;
var theta = 0.26;
var phi = 2.3;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var cBuffer1;
var cBuffer2;

var vBuffer1;
var vBuffer2;
var positionLoc;
var program;

var numPosCube= 36;
var posCubeArray = [];
var colorsCubeArray = [];
var verticesCube = [
    vec4(-0.5, -0.5,  1.5, 1.0),
    vec4(-0.5,  0.5,  1.5, 1.0),
    vec4(0.5,  0.5,  1.5, 1.0),
    vec4(0.5, -0.5,  1.5, 1.0),
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0)
];
var vertexCubeColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0),  // white
];
function quad(a, b, c, d) {
     posCubeArray.push(verticesCube[a]);
     colorsCubeArray.push(vertexCubeColors[a]);
     posCubeArray.push(verticesCube[b]);
     colorsCubeArray.push(vertexCubeColors[a]);
     posCubeArray.push(verticesCube[c]);
     colorsCubeArray.push(vertexCubeColors[a]);
     posCubeArray.push(verticesCube[a]);
     colorsCubeArray.push(vertexCubeColors[a]);
     posCubeArray.push(verticesCube[c]);
     colorsCubeArray.push(vertexCubeColors[a]);
     posCubeArray.push(verticesCube[d]);
     colorsCubeArray.push(vertexCubeColors[a]);
}
function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

var numPosTetra= 12;
var posTetraArray = [];
var colorsTetraArray = [];
var verticesTetra = [
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.942809, 0.33333, 1.0),
    vec4(-0.816497, -0.471405, 0.33333, 1.0),
    vec4(0.816497, -0.471405, 0.33333, 1.0)
];
var vertexTetraColors = [
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0)   // blue
];
function triangle(a, b, c, colorLoc) {
    posTetraArray.push(verticesTetra[a]);
    colorsTetraArray.push(vertexTetraColors[colorLoc]);
    posTetraArray.push(verticesTetra[b]);
    colorsTetraArray.push(vertexTetraColors[colorLoc]);
    posTetraArray.push(verticesTetra[c]);
    colorsTetraArray.push(vertexTetraColors[colorLoc]);
}
function colorTetra() {
    triangle(0, 1, 2, 0); // Red face
    triangle(3, 2, 1, 1); // Yellow face
    triangle(0, 3, 1, 2); // Green face
    triangle(0, 2, 3, 3); // Blue face
}

init();

function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect =  canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // define vertices for color cube
    colorCube();
    // assign color buffer and vertex buffer for color cube
    cBuffer1 = gl.createBuffer();
    vBuffer1 = gl.createBuffer();

    // define vertices for color tetrahderon
    colorTetra();
    // assign color buffer and vertex buffer for color tetrahderon
    cBuffer2 = gl.createBuffer();
    vBuffer2 = gl.createBuffer();

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    render();
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    // ==== color buffer for cube ==== 
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsCubeArray), gl.STATIC_DRAW);
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
    // ==== bind and send vertex info for cube to vertex shader ====
    projectionMatrix = perspective(fovy, aspect, near, far);
    var S = scale(0.5,0.5,0.5);
    var Tx = translate(-1.0,0,0);
    modelViewMatrix = lookAt(eye, at , up);
    modelViewMatrix = mult(modelViewMatrix,Tx);
    modelViewMatrix = mult(modelViewMatrix,S);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(posCubeArray), gl.STATIC_DRAW);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, numPosCube);

    // ==== color buffer for tretrahedron ==== 
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsTetraArray), gl.STATIC_DRAW);
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
    // ==== bind and send vertex info for tretrahedron to vertex shader ====
    var Tx = translate(1.0, 0, 0);
    var S = scale(0.75, 0.75, 0.75);
    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, Tx);
    modelViewMatrix = mult(modelViewMatrix, S);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(posTetraArray), gl.STATIC_DRAW);
    positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));  
    // loop thru three vertices for each face/triangle of the tetrahedron
    for( var i = 0; i < 12; i+=3)
        gl.drawArrays(gl.TRIANGLES, i, 3);

}