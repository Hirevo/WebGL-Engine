import { Material, ProgramList } from "../Material";
import { Renderer } from "../Renderer";
import { Constants } from "../Engine";

interface NormalMaterialRenderParameters {
    uMMatrix: BABYLON.Matrix;
    uVMatrix: BABYLON.Matrix;
    uPMatrix: BABYLON.Matrix;
    uNormalMatrix: BABYLON.Matrix;
}

const programs: ProgramList = {};

export class NormalMaterial extends Material {

    get identifier(): string { return "NormalMaterial"; };

    constructor() {
        super(Constants.normalMaterialVertexShader, Constants.normalMaterialFragmentShader);
        this.programs = programs;
    }

    setUniforms(renderer: Renderer, options: NormalMaterialRenderParameters) {
        renderer.programs[this.identifier].setUniform(renderer, "uMMatrix", options.uMMatrix);
        renderer.programs[this.identifier].setUniform(renderer, "uVMatrix", options.uVMatrix);
        renderer.programs[this.identifier].setUniform(renderer, "uPMatrix", options.uPMatrix);

        renderer.programs[this.identifier].setUniform(renderer, "uNormalMatrix", options.uNormalMatrix);
    }

    clone() {
        return new NormalMaterial();
    }
}