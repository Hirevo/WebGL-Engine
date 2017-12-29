import { Renderer } from "./Renderer";

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

interface Locations {
    [name: string]: WebGLUniformLocation;
}

export class Program {

    handle: WebGLProgram;
    locations: Locations;

    constructor(renderer: Renderer, vertexShader: string, fragmentShader: string) {
        this.locations = {};
        let handle = renderer.gl.createProgram();
        if (handle === null)
            throw "Can't create program"
        this.handle = handle;

        let vHandle = renderer.gl.createShader(renderer.gl.VERTEX_SHADER);
        if (vHandle === null)
            throw "Can't create vertex shader";

        let fHandle = renderer.gl.createShader(renderer.gl.FRAGMENT_SHADER);
        if (fHandle === null)
            throw "Can't create fragment shader";

        renderer.gl.shaderSource(vHandle, vertexShader);
        renderer.gl.shaderSource(fHandle, fragmentShader);

        renderer.gl.compileShader(vHandle);
        if (renderer.gl.getShaderParameter(vHandle, renderer.gl.COMPILE_STATUS) == false)
            throw renderer.gl.getShaderInfoLog(vHandle);

        renderer.gl.compileShader(fHandle);
        if (renderer.gl.getShaderParameter(fHandle, renderer.gl.COMPILE_STATUS) == false)
            throw renderer.gl.getShaderInfoLog(fHandle);

        renderer.gl.attachShader(this.handle, vHandle);
        renderer.gl.attachShader(this.handle, fHandle);

        renderer.gl.bindAttribLocation(this.handle, 0, "aPosition");
        renderer.gl.bindAttribLocation(this.handle, 1, "aNormal");

        renderer.gl.linkProgram(this.handle);
        if (renderer.gl.getProgramParameter(this.handle, renderer.gl.LINK_STATUS) == false)
            throw renderer.gl.getProgramInfoLog(this.handle);

        renderer.gl.validateProgram(this.handle);
        if (renderer.gl.getProgramParameter(this.handle, renderer.gl.VALIDATE_STATUS) == false)
            throw renderer.gl.getProgramInfoLog(this.handle);

        renderer.gl.deleteShader(vHandle);
        renderer.gl.deleteShader(fHandle);
    }

    bind(renderer: Renderer) {
        renderer.gl.useProgram(this.handle);
    }

    unbind(renderer: Renderer) {
        renderer.gl.useProgram(null);
    }

    setUniform(renderer: Renderer, name: string, content: number | BABYLON.Vector2 | BABYLON.Vector3 | BABYLON.Vector4 | BABYLON.Color4 | BABYLON.Matrix) {
        if (this.locations[name] === undefined) {
            let location = renderer.gl.getUniformLocation(this.handle, name);
            if (location === null) {
                console.error(`'${name}' uniform variable was not found !`);
                return;
            }
            this.locations[name] = location;
        }

        if (typeof (content) == "number")
            renderer.gl.uniform1f(this.locations[name], content);
        else if (content instanceof BABYLON.Vector2)
            renderer.gl.uniform2fv(this.locations[name], content.asArray());
        else if (content instanceof BABYLON.Vector4)
            renderer.gl.uniform4fv(this.locations[name], content.asArray());
        else if (content instanceof BABYLON.Vector3)
            renderer.gl.uniform3fv(this.locations[name], content.asArray());
        else if (content instanceof BABYLON.Color4)
            renderer.gl.uniform4fv(this.locations[name], content.asArray());
        else if (content instanceof BABYLON.Matrix)
            renderer.gl.uniformMatrix4fv(this.locations[name], false, content.asArray());
    }
}

export function map(val: number, a: number, b: number, A: number, B: number) {
    return (val - a) * (B - A) / (b - a) + A;
}