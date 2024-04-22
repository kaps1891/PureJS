let gl;
let program;
let canvas;

function init() {
    // Get the WebGL rendering context
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL context initialization failed');
        return;
    }

    // Create shaders
    const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
        }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create shader program
    program = createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
        console.error('Shader program creation failed');
        return;
    }

    // Set up buffers and attributes
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = [
        -1.0, -1.0,
         1.0, -1.0,
         0.0,  1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear the color buffer

    // Use the shader program
    gl.useProgram(program);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw the triangle
}

// Helper functions to create shader and program
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.error('Program linking failed:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

onmessage = function(event) {
    if (event.data.type === 'init') {
        canvas = event.data.canvas;
        init();
    } else if (event.data.type === 'render') {
        render();
    }
};
