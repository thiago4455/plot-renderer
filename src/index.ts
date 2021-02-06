import test from './shaders/test.glsl';
import Shader from './utils/Shader';
import Stats from 'stats.js';

const positions = [
    -1.0, -1.0,
    +1.0, -1.0,
    +1.0, +1.0,
    -1.0, +1.0
  ];

var UNITS_X = 10
var X_SHIFT = -2
var Y_SHIFT = -2

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom

function replaceFunction(s: string, f: string){
    let formated_function = f.replace(/\d+(\.|\,)?\d*/g, (m: string): string => {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1
        }).format(parseFloat(m.replace(',','.')));
    })
    return s.replace("/*FUNCTION_REPLACEMENT*/", formated_function)
}

function main(){
    
    if(!gl)
    alert("Falha ao carregar o WebGL.")

    let shader = new Shader(replaceFunction(test, input.value || input.placeholder));
    const program = gl.createProgram();
    shader.attach(program, true);
    if(!shader.compileStatus) return;

    gl.linkProgram(program);
    gl.useProgram(program);

    let positionAttributeLocation: number;
    var SCALAR_at: WebGLUniformLocation;
    var X_SHIFT_at: WebGLUniformLocation;
    var Y_SHIFT_at: WebGLUniformLocation;

    positionAttributeLocation = gl.getAttribLocation(program, "position");
    SCALAR_at = gl.getUniformLocation(program, "SCALAR");
    X_SHIFT_at = gl.getUniformLocation(program, "X_SHIFT");
    Y_SHIFT_at = gl.getUniformLocation(program, "Y_SHIFT");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.uniform1f(X_SHIFT_at, X_SHIFT);
    gl.uniform1f(Y_SHIFT_at, Y_SHIFT);
    gl.uniform1f(SCALAR_at, UNITS_X/gl.canvas.width);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(.17, .17, .17, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);



    canvas.onwheel = (e: WheelEvent) => {
        stats.begin();
        e.preventDefault();
        UNITS_X += e.deltaY/30;
        UNITS_X = Math.max(2,UNITS_X);
        gl.uniform1f(SCALAR_at, UNITS_X/gl.canvas.width);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        stats.end();
    }

    var mouseDown = false;
    canvas.onmousedown = e => {mouseDown = true;}
    canvas.onmouseup = e => {mouseDown = false;}
    canvas.onmousemove = e => {
        stats.begin();
        if(mouseDown){
            X_SHIFT -= e.movementX * UNITS_X/gl.canvas.width;
            Y_SHIFT += e.movementY * UNITS_X/gl.canvas.width;
            gl.uniform1f(X_SHIFT_at, X_SHIFT);
            gl.uniform1f(Y_SHIFT_at, Y_SHIFT);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }

        stats.end();
    }
    input.oninput = (e) => {
        shader.deatach();
        gl.deleteProgram(program);
        main();
    }
}

window.onload = () => {
    document.body.appendChild( stats.dom );
    input.value = input.value || "sin(PI*x)";
    input.oninput = (e) => {
        main();
    }
    main();
}