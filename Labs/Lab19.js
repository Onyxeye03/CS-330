"use strict";
var gl;
var points;
// isoceles triangles to form a tetrahedron
    points=[
    vec4(  0.00 ,  0.50 ,  0.00 , 1.0 ),
    vec4( -0.50 , -0.50 ,  0.50 , 1.0 ),
    vec4(  0.50 , -0.50 ,  0.50 , 1.0 ),
    vec4(  0.50 , -0.50 , -0.50 , 1.0 )
    ];

var flag = true;

var texture;
var program;

var texSize = 64;
/*
// Create a checkerboard pattern using floats
var image1 = new Array()
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
        var c = (((i & 0x8) == 0) ^ ((j & 0x8) == 0));
        image1[i][j] = [c, c, c, 1];
    }

// Convert floats to ubytes for texture
var image2 = new Uint8Array(4*texSize*texSize);
    for (var i = 0; i < texSize; i++)
        for (var j = 0; j < texSize; j++)
           for(var k =0; k<4; k++)
                image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];
*/
var texCoordsArray = [];

// perpendicular texture w/isoceles triangle
var texCoord = [
    vec2(0.5, 0),
    vec2(0  , 1),
    vec2(1  , 1)
];

var positionsArray = [];
var colorsArray = [];
var vertexColors = [
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0)  // green
];

window.onload = init;

function configureTexture( image ) {

}

function triangle (a,b,c,triNum)
{
   positionsArray.push(points[a]);
   colorsArray.push(vertexColors[triNum]);
   texCoordsArray.push(texCoord[0]);

   positionsArray.push(points[b]);
   colorsArray.push(vertexColors[triNum]);
   texCoordsArray.push(texCoord[1]);

   positionsArray.push(points[c]);
   colorsArray.push(vertexColors[triNum]);
   texCoordsArray.push(texCoord[2]);
}

function colorTetra()
{
    triangle(0,1,2 ,0);
    triangle(0,2,3 ,1);
    triangle(0,3,1 ,2);
    triangle(1,3,2 ,3);
}

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = vec3(45.0, 45.0, 45.0);

var thetaLoc;

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorTetra();
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    // color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    var colorLoc =gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // positions buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
    var positionLoc =gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);



    thetaLoc = gl.getUniformLocation(program, "uTheta");

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, positionsArray.length );
    requestAnimationFrame(render);
}