// Create a WebGL canvas
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl');
const vertexShaderSource = `
#version 300 es

in vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

out vec4 vColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
}
`;

const fragmentShaderSource = `
#version 300 es

precision mediump float;
in vec4 vColor;
out vec4 fColor;

void main() {
    fColor = vColor;
}
`;
const program = initShaders(gl, "#vertex-shader", "#fragment-shader");
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Check for shader compilation errors
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the vertex shader: ' + gl.getShaderInfoLog(vertexShader));
}

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the fragment shader: ' + gl.getShaderInfoLog(fragmentShader));
}
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
    console.error(gl.getProgramInfoLog(program));
}

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
    console.error(gl.getProgramInfoLog(program)); 
}

// Define the shapes
const shape1 = [
    -1.0, -1.0, 0.0, 1.0,  // Vertex 1 (x, y, z, color)
    1.0, -1.0, 0.0, 0.0,  // Vertex 2 (x, y, z, color)
    1.0, 1.0, 0.0, 1.0,   // Vertex 3 (x, y, z, color)
    -1.0, 1.0, 0.0, 0.0,  // Vertex 4 (x, y, z, color)
];

const shape2 = [
    -0.5, -0.5, 0.0, 0.0,
    0.5, -0.5, 0.0, 1.0,
    0.5, 0.5, 0.0, 1.0,
    -0.5, 0.5, 0.0, 0.0,
];

// Create buffers
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape1), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition');
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttributeLocation);
// Set up the morph parameter
int main() {
    int i, j, k;


	//fill matrices
	for (i = 0; i < N; i++) {
		for (j = 0; j < N; j++) {
			A[i][j] = 10 * rand() + 2 * double(i) * double(j);
			B[i][j] = 10 * rand() + -2 * double(i) * double(j);
			C[i][j] = 0.0;
		}
	}

	/
	//print matrices
	for (i = 0; i < N; i++) {
		cout << "A:row " << i << " ";
		for (j = 0; j < N; j++) cout << A[i][j] << " ";
		cout << endl;
	}
	cout << endl;
	for (i = 0; i < N; i++) {
		cout << "B:row " << i << " ";
		for (j = 0; j < N; j++) cout << B[i][j] << " ";
		cout << endl;
	}
	cout << endl;
	for (i = 0; i < N; i++) {
		cout << "C:row " << i << " ";
		for (j = 0; j < N; j++) cout << C[i][j] << " ";
		cout << endl;
	}
	cout << endl;
	* /

	//multiply

	for (i = 0; i < N; i++)
		for (j = 0; j < N; j++)
			for (k = 0; k < N; k++) C[i][j] = C[i][j] + A[i][k] * B[k][j];


	cout << endl;
	for (i = 0; i < N; i++) {
		cout << "C:row " << i << " ";
		for (j = 0; j < N; j++) cout << C[i][j] << " ";
		cout << endl;
	}
	cout << endl;



}

let t = 0.0;

// Animation loop
const render = () => {
    // Update the morph parameter
    t += 0.01;
    if (t > 1.0) {
        t = 0.0;
    }

    // Update the vertex buffer with the morphed shape
    const morphedShape = vertexBuffer.data; // Get a reference to the buffer's data
    for (let i = 0; i < shape1.length; i++) {
        morphedShape[i] = (1 - t) * shape1[i] + t * shape2[i];
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, morphedShape); // Update a part of the buffer

    // Set the morph parameter in the shader
    const tLocation = gl.getUniformLocation(program, 't');
    gl.uniform1f(tLocation, t);

    // Draw the shape
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    requestAnimationFrame(render);
};

requestAnimationFrame(render);