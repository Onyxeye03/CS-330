"use strict";
var gl;
var points;

var theta = [0, 0, 0];
var thetaLoc;

var translate = 0.0;
var translateLoc;

var scale = 1.0;
var scaleLoc;

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
    vec4(  0.00 ,  0.00 ,  0.00 ,  1.00 ),
    vec4(  0.25 ,  0.00 ,  0.00 ,  1.00 ),
    vec4(  0.25 ,  0.25 ,  0.00 ,  1.00 ),
    vec4(  0.00 ,  0.25 ,  0.00 ,  1.00 )
    ];
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc , 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    translateLoc = gl.getUniformLocation(program, "uTranslate");
    scaleLoc = gl.getUniformLocation(program, "uScale");

    //event listeners for buttons
    document.getElementById( "Transform" ).onclick = function () {
        theta = [0, 0, 45];
        translate = 0.25;
        scale = 1.5;
        render();
    };

    render();

};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniform3fv(thetaLoc, theta);
    gl.uniform1f(translateLoc, translate);
    gl.uniform1f(scaleLoc, scale);

    gl.drawArrays( gl.LINE_LOOP, 0, points.length );
}