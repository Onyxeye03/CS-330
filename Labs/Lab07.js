"use strict";

var gl;

var theta = 0.0;
var thetaLoc;

var color = vec4(0.0, 0.0, 1.0, 1.0);
var colorLoc;

var delay = 100;
var rotation = true;

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vertices = [
    vec2(-0.5, 0.0), // Bottom left corner
    vec2(0.5, 0.0),  // Bottom right corner
    vec2(0.0, 0.5)   // Top vertex
    ];
    
    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation( program, "uTheta" );

    //define the uniform variable in the shader, aColor
    colorLoc = gl.getUniformLocation(program, "aColor");

    function toggleRotation() {
        rotation = !rotation; // Toggle the rotation variable
    }
    var rotationButton = document.getElementById("Rotation");
    rotationButton.addEventListener("click", toggleRotation);


    window.addEventListener("keydown", function (event) {
      switch (event.keyCode) {
        case 49: // 1 key
          toggleRotation();
          break;
        case 50: // 2 key
          color = vec4(1.0, 0.0, 0.0, 1.0); // Red
          break;
        case 51: // 3 key
          color = vec4(0.0, 1.0, 0.0, 1.0); // Green
          break;
      }
    });


    render(color);
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += (rotation ? 0.1 : 0.0);
    gl.uniform1f(thetaLoc, theta);

    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    setTimeout(
        function (){requestAnimationFrame(render);}, delay
    );
}
