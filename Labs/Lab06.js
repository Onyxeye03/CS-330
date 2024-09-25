"use strict";
var gl;
var points;
var colors;
var sliderVal = 1;

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
    vec2(-0.95,0.95),
    vec2(0,0.95),
    vec2(0.95,0.95),
    vec2(-0.95,0.0),
    vec2(0,0.0),
    vec2(0.95,0.0),
    vec2(-0.95,-0.95),
    vec2(0.0,-0.95),
    vec2(0.95,-0.95)
    ];

    colors= [
        // Define RGB values for each point
        vec4(1.0, 0.0, 0.0, 1.0), // Red
        vec4(0.0, 1.0, 0.0, 1.0), // Green
        vec4(0.0, 0.0, 1.0, 1.0), // Blue
        vec4(1.0, 1.0, 0.0, 1.0), // Yellow
        vec4(1.0, 0.0, 1.0, 1.0), // Magenta
        vec4(0.0, 1.0, 1.0, 1.0), // Cyan  
        vec4(0.5, 0.5, 0.5, 1.0), // Gray
        vec4(1.0, 0.5, 0.0, 1.0), // Orange
        vec4(0.0, 0.5, 1.0, 1.0)  // Teal
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
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    // a color buffer is created and attached
    var cbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );
   
    //Create Slider
    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = 1;
    slider.max = points.length;
    slider.value = sliderVal;
        // slider event listener
    slider.addEventListener("input", function() {
        sliderVal = parseInt(slider.value);
        render();
    });
    document.body.appendChild(slider);

    render();
};

function render() {
  // Assuming points is an array containing the points to render
  var pointsToRender = points.slice(0, sliderVal); // Only render points up to the slider value

  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.POINTS, 0, pointsToRender.length );
}

