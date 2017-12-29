import { Material } from "../Material";
import { Renderer } from "../Renderer";
import { Constants } from "../Engine";

interface NormalMaterialRenderParameters {
    uMMatrix: BABYLON.Matrix;
    uVMatrix: BABYLON.Matrix;
    uPMatrix: BABYLON.Matrix;
    uNormalMatrix: BABYLON.Matrix;
}

export class NormalMaterial extends Material {
    constructor() {
        super(Constants.normalMaterialVertexShader, Constants.normalMaterialFragmentShader);
    }

    setUniforms(renderer: Renderer, options: NormalMaterialRenderParameters) {
        this.programs[renderer.id].setUniform(renderer, "uMMatrix", options.uMMatrix);
        this.programs[renderer.id].setUniform(renderer, "uVMatrix", options.uVMatrix);
        this.programs[renderer.id].setUniform(renderer, "uPMatrix", options.uPMatrix);

        this.programs[renderer.id].setUniform(renderer, "uNormalMatrix", options.uNormalMatrix);
    }

    clone() {
        return new NormalMaterial();
    }
}