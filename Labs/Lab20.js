"use strict";
var gl;

var flag=true;

var points;
// triangle on right on top
/*
points=[
    vec4( -0.75 , -0.50 , 0.0 , 1.0  ),
    vec4(  0.25 ,  0.00 , 0.0 , 1.0  ),
    vec4( -0.75 ,  0.50 , 0.0 , 1.0  ),
    vec4( -0.25 ,  0.00 , 0.0 , 1.0  ),
    vec4(  0.75 , -0.50 , 0.0 , 1.0  ),
    vec4(  0.75 ,  0.50 , 0.0 , 1.0  )
];
*/
// triangle on left on top
//
points=[
    vec4( -0.25 ,  0.00 , 0.0 , 1.0  ),
    vec4(  0.75 , -0.50 , 0.0 , 1.0  ),
    vec4(  0.75 ,  0.50 , 0.0 , 1.0  ),
    vec4( -0.75 , -0.50 , 0.0 , 1.0  ),
    vec4(  0.25 ,  0.00 , 0.0 , 1.0  ),
    vec4( -0.75 ,  0.50 , 0.0 , 1.0  )
];
//
var positionsArray = [];

var colors;
colors=[
    vec4( 1.0 , 1.0 , 0.0 , 0.50 ),
    vec4( 0.0 , 1.0 , 1.0 , 0.50 )
];
var colorsArray = [];

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //set up triangles and colors
    for (var i=0; i<points.length; i++)
    {
      positionsArray.push(points[i]);
      colorsArray.push(colors[ Math.floor(i/3) ]);
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    // color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex buffer
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW );
    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc , 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    document.getElementById("Button").onclick = function(){
        if(flag) gl.enable(gl.DEPTH_TEST);
        else gl.disable(gl.DEPTH_TEST);
        if(flag) gl.enable(gl.CULL_FACE);
        else gl.disable(gl.CULL_FACE);
        flag = !flag;
    };

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, positionsArray.length );
    requestAnimationFrame(render);
}