import { Program } from "./utils";
import { Renderer } from "./Renderer";

interface ProgramList {
    [rendererId: string]: Program;
}

export class Material {

    protected programs: ProgramList;
    protected vertexSource: string;
    protected fragmentSource: string;

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
        this.programs[renderer.id] = new Program(renderer, this.vertexSource, this.fragmentSource);
    }

    bind(renderer: Renderer) {
        this.programs[renderer.id].bind(renderer);
    }

    unbind(renderer: Renderer) {
        this.programs[renderer.id].unbind(renderer);
    }

    setUniforms(renderer: Renderer, options: any) {
        throw "Method not yet implemented !"
    }

    clone() {
        return new Material(this.vertexSource, this.fragmentSource)
    }

}