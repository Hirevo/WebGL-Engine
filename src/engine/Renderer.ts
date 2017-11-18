import { Scene } from "./Scene";
import { Camera } from "./Camera";

export class Renderer {

    id: string;
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    private modes: number[];
    private mode: number;

    constructor(id: string) {
        this.id = id;
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        let ctx = this.canvas.getContext("webgl");
        if (ctx == null)
            throw "WebGL not supported !";
        this.gl = ctx;

        this.gl.clearDepth(1);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0, 0, 0, 1);
        this.modes = [this.gl.TRIANGLES, this.gl.LINES, this.gl.POINTS];
        this.mode = 0;
    }

    setMode(mode: number) {
        this.mode = mode % 3;
    }

    getModeIdx() {
        return this.mode;
    }

    getMode() {
        return this.modes[this.mode];
    }

    render(scene: Scene, camera: Camera) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        scene.render(this, camera);
    }

}