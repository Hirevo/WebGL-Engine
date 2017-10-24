import gl from "./../index"

export interface Vertex {
    pos: BABYLON.Vector3;
    normal: BABYLON.Vector3;
}

export interface Face {
    v1: Vertex;
    v2: Vertex;
    v3: Vertex;
    normal: BABYLON.Vector3;
}

export class Program {

    handle: WebGLProgram;

    constructor(vertexShader: string, fragmentShader: string) {
        let handle = gl.createProgram();
        if (handle === null)
            throw "Can't create program"
        this.handle = handle;

        let vHandle = gl.createShader(gl.VERTEX_SHADER);
        if (vHandle === null)
            throw "Can't create vertex shader"

        let fHandle = gl.createShader(gl.FRAGMENT_SHADER);
        if (fHandle === null)
            throw "Can't create fragment shader"

        gl.shaderSource(vHandle, vertexShader);
        gl.shaderSource(fHandle, fragmentShader);

        gl.compileShader(vHandle);
        if (gl.getShaderParameter(vHandle, gl.COMPILE_STATUS) == false)
            throw gl.getShaderInfoLog(vHandle);

        gl.compileShader(fHandle);
        if (gl.getShaderParameter(fHandle, gl.COMPILE_STATUS) == false)
            throw gl.getShaderInfoLog(fHandle);

        gl.attachShader(this.handle, vHandle);
        gl.attachShader(this.handle, fHandle);

        gl.bindAttribLocation(this.handle, 0, "aPosition")
        gl.bindAttribLocation(this.handle, 1, "aNormal")

        gl.linkProgram(this.handle);
        if (gl.getProgramParameter(this.handle, gl.LINK_STATUS) == false)
            throw gl.getProgramInfoLog(this.handle);

        gl.validateProgram(this.handle);
        if (gl.getProgramParameter(this.handle, gl.VALIDATE_STATUS) == false)
            throw gl.getProgramInfoLog(this.handle);

        gl.deleteShader(vHandle);
        gl.deleteShader(fHandle);
    }

    bind() {
        gl.useProgram(this.handle);
    }

    unbind() {
        gl.useProgram(null);
    }

    setUniform(name: string, content: number | BABYLON.Vector2 | BABYLON.Vector3 | BABYLON.Vector4 | BABYLON.Color4 | BABYLON.Matrix) {
        let location = gl.getUniformLocation(this.handle, name);
        if (location === null) {
            console.error(`'${name}' uniform variable was not found !`);
            return;
        }

        if (typeof (content) == "number")
            gl.uniform1f(location, content);
        else if (content instanceof BABYLON.Vector2)
            gl.uniform2fv(location, content.asArray())
        else if (content instanceof BABYLON.Vector4)
            gl.uniform4fv(location, content.asArray())
        else if (content instanceof BABYLON.Vector3)
            gl.uniform3fv(location, content.asArray())
        else if (content instanceof BABYLON.Color4)
            gl.uniform4fv(location, content.asArray())
        else if (content instanceof BABYLON.Matrix)
            gl.uniformMatrix4fv(location, false, content.asArray())
    }
}

export function map(val: number, a: number, b: number, A: number, B: number) {
    return (val - a) * (B - A) / (b - a) + A
}