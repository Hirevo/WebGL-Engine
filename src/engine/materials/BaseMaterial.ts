import { Material, ProgramList } from "../Material";
import { Renderer } from "../Renderer";
import { Constants } from "../Engine";

interface BasicMaterialRenderParameters {
    uMMatrix: BABYLON.Matrix;
    uVMatrix: BABYLON.Matrix;
    uPMatrix: BABYLON.Matrix;
}

const programs: ProgramList = {};

export class BasicMaterial extends Material {

    color: BABYLON.Vector4;
    get identifier(): string { return "BasicMaterial"; };

    constructor(color: BABYLON.Vector4) {
        super(Constants.baseMaterialVertexShader, Constants.baseMaterialFragmentShader);
        this.color = color;
        this.programs = programs;
    }

    setColor(v1: number | BABYLON.Vector4, v2?: number, v3?: number, v4?: number) {
        if (v1 instanceof BABYLON.Vector4)
            this.color = v1;
        else if (v2 !== undefined && v3 !== undefined) {
            if (v4 !== undefined) {
                this.color.x = v1;
                this.color.y = v2;
                this.color.z = v3;
                this.color.w = v4;
            } else {
                this.color.x = v1;
                this.color.y = v2;
                this.color.z = v3;
                this.color.w = 1;
            }
        } else {
            this.color.x = v1;
            this.color.y = v1;
            this.color.z = v1;
            this.color.w = v1;
        }
    }

    setUniforms(renderer: Renderer, options: BasicMaterialRenderParameters) {
        renderer.programs[this.identifier].setUniform(renderer, "uMMatrix", options.uMMatrix);
        renderer.programs[this.identifier].setUniform(renderer, "uVMatrix", options.uVMatrix);
        renderer.programs[this.identifier].setUniform(renderer, "uPMatrix", options.uPMatrix);

        renderer.programs[this.identifier].setUniform(renderer, "color", this.color);
    }

    clone() {
        return new BasicMaterial(this.color);
    }
}