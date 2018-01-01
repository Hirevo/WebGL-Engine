import { Program } from "./utils";
import { Renderer } from "./Renderer";

export interface ProgramList {
    [rendererId: string]: Program;
}

export class Material {

    protected programs: ProgramList;
    protected vertexSource: string;
    protected fragmentSource: string;
    get identifier(): string { return "Material"; };

    constructor(vertexShader: string, fragmentShader: string) {
        this.programs = {}
        this.vertexSource = vertexShader;
        this.fragmentSource = fragmentShader;
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