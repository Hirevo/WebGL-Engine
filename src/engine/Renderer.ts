import { Scene } from "./Scene";
import { Camera } from "./Camera";
import { Program, Material } from "./Engine";
import { RenderTexture } from "./RenderTexture";

interface RendererProgramList {
    [material: string]: Program;
}

export class Renderer {
    id: string;
    programs: RendererProgramList;
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    private modes: number[];
    private mode: number;

    constructor(canvas: HTMLCanvasElement, contextAttributes?: WebGLContextAttributes) {
        this.id = `renderer${new Date().valueOf().toString()}`;
        this.canvas = canvas;
        let ctx = this.canvas.getContext("webgl", contextAttributes);
        if (ctx == null)
            throw "WebGL not supported !";
        this.gl = ctx;

        this.gl.clearDepth(1);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.enableVertexAttribArray(0);
        this.gl.enableVertexAttribArray(1);
        this.gl.enableVertexAttribArray(2);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.modes = [this.gl.TRIANGLES, this.gl.LINES, this.gl.POINTS];
        this.mode = 0;
        this.programs = {};
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

    render(scene: Scene, camera: Camera, renderTarget?: RenderTexture) {
        if (renderTarget)
            renderTarget.bindFramebuffer(this);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        scene.render(this, camera);
        if (renderTarget)
            renderTarget.unbindFramebuffer(this);
        // if ("commit" in this.gl)
        //     (this.gl as any).commit();
    }

}