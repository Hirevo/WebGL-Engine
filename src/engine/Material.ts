import { Program } from "./utils";
import { Renderer } from "./Renderer";
import { Texture } from "./Texture";

export interface ProgramList {
    [rendererId: string]: Program;
}

export class Material {

    protected programs: ProgramList;
    protected vertexSource: string;
    protected fragmentSource: string;
    get identifier(): string { return "Material"; };
    protected _hasTexture: boolean;
    
    texture: Texture;
    get hasTexture() { return this._hasTexture; };

    constructor(vertexShader: string, fragmentShader: string, texture?: Texture) {
        this.programs = {}
        this.vertexSource = vertexShader;
        this.fragmentSource = fragmentShader;
        if (texture !== undefined) {
            this._hasTexture = true;
            this.texture = texture;
        } else
            this._hasTexture = false;
    }

    getVertexSource() {
        return this.vertexSource;
    }

    getFragmentSource() {
        return this.fragmentSource;
    }

    initProgram(renderer: Renderer) {
        renderer.programs[this.identifier] = new Program(renderer, this.vertexSource, this.fragmentSource);
    }

    bind(renderer: Renderer) {
        renderer.programs[this.identifier].bind(renderer);
    }

    unbind(renderer: Renderer) {
        renderer.programs[this.identifier].unbind(renderer);
    }

    setUniforms(renderer: Renderer, options: any) {
        throw "Method not yet implemented !";
    }

    clone() {
        return new Material(this.vertexSource, this.fragmentSource);
    }

}