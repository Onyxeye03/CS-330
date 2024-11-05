"use strict";

var shadedCube = function() {

var canvas;
var gl;

var numPositions = 36;

var positionsArray = [];
var normalsArray = [];

var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4(0.5,  0.5,  0.5, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(0.5,  0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

// original
//orange cube, very bright
var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;
//

// black plastic
/*Pitch black cube, not very reflective
var materialAmbient  = vec4(0.0 , 0.0 , 0.0 , 1.0);
var materialDiffuse  = vec4(0.01 , 0.01 , 0.01 , 1.0);
var materialSpecular = vec4(0.5 , 0.5 , 0.5, 1.0);
var materialShininess = 32.0;
*/

// brass
/*  goldish color, light source in bottom left is reflective and washes out cube. 
var materialAmbient  = vec4(0.329412 , 0.223529 , 0.027451 , 1.0);
var materialDiffuse  = vec4(0.780392 , 0.568627 , 0.113725 , 1.0);
var materialSpecular  = vec4(0.992157 , 0.941176 , 0.807843, 1.0);
var materialShininess = 27.8974;
*/

// bronze
/*brown cube, dull, 
var materialAmbient  = vec4(0.2125 , 0.1275 , 0.054 , 1.0);
var materialDiffuse  = vec4(0.714 , 0.4284 , 0.18144 , 1.0);
var materialSpecular  = vec4(0.393548 , 0.271906 , 0.166721, 1.0);
var materialShininess = 25.6;
*/
// chrome
/* light source had minimal effect on gray
var materialAmbient  = vec4(0.25 , 0.25 , 0.25 , 1.0);
var materialDiffuse  = vec4(0.4 , 0.4 , 0.4 , 1.0);
var materialSpecular  = vec4(0.774597 , 0.774597 , 0.774597 , 1.0);
var materialShininess = 76.8;
*/

// copper
/* Reddish brownk, light source has no specular highlights on cube
var materialAmbient  = vec4(0.19125 , 0.0735 , 0.0225 , 1.0);
var materialDiffuse  = vec4(0.7038 , 0.27048 , 0.0828 , 1.0);
var materialSpecular  = vec4(0.256777 , 0.137622 , 0.086014 , 1.0);
var materialShininess = 76.8;
*/

// gold
/*yellowish brown, gold cube, more dull, not shiny
var materialAmbient  = vec4(0.24725 , 0.1995 , 0.0745 , 1.0);
var materialDiffuse  = vec4(0.75164 , 0.60648 , 0.22648 , 1.0);
var materialSpecular  = vec4(0.628281 , 0.555802 , 0.366065 , 1.0);
var materialShininess = 51.2;
*/

// pewter
/*dull dark grey
var materialAmbient  = vec4(0.10588 , 0.058824 , 0.113725 , 1.0);
var materialDiffuse  = vec4(0.42745 , 0.470588 , 0.541176 , 1.0);
var materialSpecular  = vec4(0.3333 , 0.3333 , 0.521569 , 1.0);
var materialShininess = 9.84615;
*/

// silver
/* Grey, moderately shiny
var materialAmbient  = vec4(0.19225 , 0.19225 , 0.19225 , 1.0);
var materialDiffuse  = vec4(0.50754 , 0.50754 , 0.50754 , 1.0);
var materialSpecular  = vec4(0.508273 , 0.508273 , 0.508273 , 1.0);
var materialShininess = 51.2;
*/

// polished silver
/*Light gray, large specular highlight, very reflective
var materialAmbient  = vec4(0.23125 , 0.23125 , 0.23125 , 1.0);
var materialDiffuse  = vec4(0.2775 , 0.2775 , 0.2775 , 1.0);
var materialSpecular  = vec4(0.773911 , 0.773911 , 0.773911 , 1.0);
var materialShininess = 89.6;
*/

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = vec3(0, 0, 0);

var thetaLoc;

var flag = false;

init();

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);


     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     positionsArray.push(vertices[b]);
     normalsArray.push(normal);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     positionsArray.push(vertices[d]);
     normalsArray.push(normal);
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

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = vec3(0.0, 0.0, -20.0);

    projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
       ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
       diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),
       specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
       lightPosition );

    gl.uniform1f(gl.getUniformLocation(program,
       "uShininess"), materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "uProjectionMatrix"),
       false, flatten(projectionMatrix));
    render();
}

function render(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));

    //console.log(modelView);

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "uModelViewMatrix"), false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);


    requestAnimationFrame(render);
}

}

shadedCube();
