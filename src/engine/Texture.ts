import { Renderer } from "./Engine";

interface TextureHandle {
    ready: boolean;
    texture: WebGLTexture;
}

interface TextureHandleList {
    [id: string]: TextureHandle;
}

export class Texture {
    protected handles: TextureHandleList;
    protected width: number;
    protected height: number;
    protected source: any;

    constructor(widthOrTexture: number | ImageBitmap | ImageData | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement, height = widthOrTexture) {
        this.handles = {};

        function isImageBitmap(obj: any): obj is ImageBitmap {
            return (typeof obj === "object") && (typeof obj.width === "number") && (typeof obj.height === "number") && (typeof obj.close === "function");
        }

        if (typeof widthOrTexture === "number") {
            this.source = null;
            this.width = widthOrTexture;
            this.height = height as number;
        } else if (isImageBitmap(widthOrTexture)) {
            this.source = widthOrTexture;
            this.width = widthOrTexture.width;
            this.height = widthOrTexture.height;
        } else if (widthOrTexture instanceof ImageData) {
            this.source = widthOrTexture;
            this.width = widthOrTexture.width;
            this.height = widthOrTexture.height;
        } else if (widthOrTexture instanceof HTMLImageElement) {
            this.source = widthOrTexture;
            this.width = widthOrTexture.naturalWidth;
            this.height = widthOrTexture.naturalHeight;
        } else if (widthOrTexture instanceof HTMLVideoElement) {
            this.source = widthOrTexture;
            this.width = widthOrTexture.videoWidth;
            this.height = widthOrTexture.videoHeight;
        } else if (widthOrTexture instanceof HTMLCanvasElement) {
            this.source = widthOrTexture;
            this.width = widthOrTexture.width;
            this.height = widthOrTexture.height;
        }
    }

    initTexture(renderer: Renderer) {
        if (this.handles[renderer.id] === undefined)
            this.handles[renderer.id] = { ready: false } as TextureHandle;

        if (this.handles[renderer.id].ready === true)
            return true;

        const texture = renderer.gl.createTexture();
        if (texture === null)
            return false;
        this.handles[renderer.id].texture = texture;

        renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.handles[renderer.id].texture);
        if (this.source === null)
            renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, this.width, this.height, 0, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, null);
        else
            renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, this.source);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_S, renderer.gl.CLAMP_TO_EDGE);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_T, renderer.gl.CLAMP_TO_EDGE);
        renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, null);

        this.handles[renderer.id].ready = true;
        return true;
    }

    bind(renderer: Renderer) {
        if (!this.handles[renderer.id] || !this.handles[renderer.id].ready)
            this.initTexture(renderer);
        if (this.handles[renderer.id] && this.handles[renderer.id].ready) {
            renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.handles[renderer.id].texture);
        }
    }
    
    unbind(renderer: Renderer) {
        if (this.handles[renderer.id] && this.handles[renderer.id].ready) {
            renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, null);
        }
    }
}