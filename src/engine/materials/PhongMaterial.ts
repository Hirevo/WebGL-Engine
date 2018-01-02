import { Material, ProgramList } from "../Material"
import { PointLight, SpotLight, AmbientLight } from "../Scene";
import { Renderer } from "../Renderer";
import { Constants, Texture } from "../Engine";
import phongMaterialVertexShader from "./../../../shaders/phongShading/vert.vs";
import phongMaterialFragmentShader from "./../../../shaders/phongShading/frag.fs";

interface PhongMaterialRenderParameters {
    uMMatrix: BABYLON.Matrix;
    uVMatrix: BABYLON.Matrix;
    uPMatrix: BABYLON.Matrix;
    uVInvMatrix: BABYLON.Matrix;
    uNormalMatrix: BABYLON.Matrix;
    pointLights: PointLight[];
    spotLights: SpotLight[];
    ambientLight: AmbientLight;
}

interface PhongMaterialParameters {
    color?: BABYLON.Vector4;
    diffuse?: number;
    specular?: number;
    shininess?: number;
    texture?: Texture;
}

const programs: ProgramList = {};

export class PhongMaterial extends Material {
    specular = 1;
    shininess = 1;
    diffuse = 1;
    color: BABYLON.Vector4;
    get identifier(): string { return "PhongMaterial"; };
    
    constructor(options: PhongMaterialParameters = { color: new BABYLON.Vector4(1, 1, 1, 1), diffuse: 1, specular: 1, shininess: 1, texture: undefined }) {
        super(phongMaterialVertexShader, phongMaterialFragmentShader, options.texture);
        this.color = (options.color === undefined) ? new BABYLON.Vector4(1, 1, 1, 1) : options.color;
        this.diffuse = (options.diffuse === undefined) ? 1 : options.diffuse;
        this.specular = (options.specular === undefined) ? 1 : options.specular;
        this.shininess = (options.shininess === undefined) ? 1 : options.shininess;
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

    setUniforms(renderer: Renderer, options: PhongMaterialRenderParameters) {
        renderer.programs[this.identifier].setUniform(renderer, "uMMatrix", options.uMMatrix);
        renderer.programs[this.identifier].setUniform(renderer, "uVMatrix", options.uVMatrix);
        renderer.programs[this.identifier].setUniform(renderer, "uPMatrix", options.uPMatrix);

        renderer.programs[this.identifier].setUniform(renderer, "uVInvMatrix", options.uVInvMatrix);

        renderer.programs[this.identifier].setUniform(renderer, "uALight.color", options.ambientLight.color);

        renderer.programs[this.identifier].setUniform(renderer, "uNbPLights", options.pointLights.length);
        options.pointLights.forEach((light, idx) => {
            renderer.programs[this.identifier].setUniform(renderer, `uPLights[${idx}].pos`, light.pos);
            renderer.programs[this.identifier].setUniform(renderer, `uPLights[${idx}].color`, light.color);
            renderer.programs[this.identifier].setUniform(renderer, `uPLights[${idx}].intensity`, light.intensity);
        });

        renderer.programs[this.identifier].setUniform(renderer, "uNbSLights", options.spotLights.length);
        options.spotLights.forEach((light, idx) => {
            renderer.programs[this.identifier].setUniform(renderer, `uSLights[${idx}].pos`, light.pos);
            renderer.programs[this.identifier].setUniform(renderer, `uSLights[${idx}].dir`, light.dir);
            renderer.programs[this.identifier].setUniform(renderer, `uSLights[${idx}].aper`, light.aperture);
            renderer.programs[this.identifier].setUniform(renderer, `uSLights[${idx}].color`, light.color);
            renderer.programs[this.identifier].setUniform(renderer, `uSLights[${idx}].intensity`, light.intensity);
        })

        renderer.programs[this.identifier].setUniform(renderer, "uNormalMatrix", options.uNormalMatrix);

        renderer.programs[this.identifier].setUniform(renderer, "uColor", this.color);
        renderer.programs[this.identifier].setUniform(renderer, "uHasTexture", this._hasTexture);
        renderer.programs[this.identifier].setUniform(renderer, "uTexture", 0, "int");

        renderer.programs[this.identifier].setUniform(renderer, "diffuse", this.diffuse);
        renderer.programs[this.identifier].setUniform(renderer, "specular", this.specular);
        renderer.programs[this.identifier].setUniform(renderer, "shininess", this.shininess);
    }

    clone() {
        return new PhongMaterial({ color: this.color, diffuse: this.diffuse, specular: this.specular, shininess: this.shininess });
    }

}