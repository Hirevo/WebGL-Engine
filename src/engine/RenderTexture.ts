import { Renderer } from "./Engine";
import { Texture } from "./Texture";

interface RenderTextureHandle {
    ready: boolean;
    texture: WebGLTexture;
    depthBuffer: WebGLRenderbuffer;
    framebuffer: WebGLFramebuffer;
}

interface RenderTextureHandleList {
    [id: string]: RenderTextureHandle;
}

export class RenderTexture extends Texture {
    protected handles: RenderTextureHandleList;

    constructor(width: number, height: number) {
        super(width, height);
    }

    initTexture(renderer: Renderer) {
        if (this.handles[renderer.id] === undefined)
            this.handles[renderer.id] = { ready: false } as RenderTextureHandle;

        if (this.handles[renderer.id].ready === true)
            return true;

        const texture = renderer.gl.createTexture();
        if (texture === null)
            return false;
        this.handles[renderer.id].texture = texture;

        renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.handles[renderer.id].texture);
        renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, this.width, this.height, 0, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, null);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_S, renderer.gl.CLAMP_TO_EDGE);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_T, renderer.gl.CLAMP_TO_EDGE);
        
        const fb = renderer.gl.createFramebuffer();
        if (fb === null)
        return false;
        this.handles[renderer.id].framebuffer = fb;
        
        renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, this.handles[renderer.id].framebuffer);
        renderer.gl.framebufferTexture2D(renderer.gl.FRAMEBUFFER, renderer.gl.COLOR_ATTACHMENT0, renderer.gl.TEXTURE_2D, this.handles[renderer.id].texture, 0);

        const depthBuffer = renderer.gl.createRenderbuffer();
        if (depthBuffer === null)
            return false;
        this.handles[renderer.id].depthBuffer = depthBuffer;

        renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, this.handles[renderer.id].depthBuffer);
        renderer.gl.renderbufferStorage(renderer.gl.RENDERBUFFER, renderer.gl.DEPTH_COMPONENT16, this.width, this.height);
        renderer.gl.framebufferRenderbuffer(renderer.gl.FRAMEBUFFER, renderer.gl.DEPTH_ATTACHMENT, renderer.gl.RENDERBUFFER, this.handles[renderer.id].depthBuffer);

        renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, null);
        renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, null);
        renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, null);

        this.handles[renderer.id].ready = true;
        return true;
    }

    bindFramebuffer(renderer: Renderer) {
        if (!this.handles[renderer.id] || !this.handles[renderer.id].ready)
            this.initTexture(renderer);
        if (this.handles[renderer.id] && this.handles[renderer.id].ready) {
            renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, this.handles[renderer.id].framebuffer);
            renderer.gl.viewport(0, 0, this.width, this.height);
        }
    }

    unbindFramebuffer(renderer: Renderer) {
        if (this.handles[renderer.id] && this.handles[renderer.id].ready) {
            renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, null);
            renderer.gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
        }
    }
}