import { Material } from "../Material"
import { PointLight, SpotLight, AmbientLight } from "../Scene";
import { Renderer } from "../Renderer";
import { Constants } from "../Engine";

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
}

export class PhongMaterial extends Material {

    specular = 1;
    shininess = 1;
    diffuse = 1;
    color: BABYLON.Vector4;
    texture: number | undefined;

    constructor(options: PhongMaterialParameters = { color: new BABYLON.Vector4(1, 1, 1, 1), diffuse: 1, specular: 1, shininess: 1 }) {
        super(Constants.phongMaterialVertexShader, Constants.phongMaterialFragmentShader);
        this.color = (options.color === undefined) ? new BABYLON.Vector4(1, 1, 1, 1) : options.color;
        this.diffuse = (options.diffuse === undefined) ? 1 : options.diffuse;
        this.specular = (options.specular === undefined) ? 1 : options.specular;
        this.shininess = (options.shininess === undefined) ? 1 : options.shininess;
        this.texture = undefined;
    }

    async loadTexture() {
        // this.texture = gl;
    }

    isTextured() {
        return this.texture === undefined;
    }

    setColor(v1: number | BABYLON.Vector4, v2?: number, v3?: number, v4?: number) {
        if (v1 instanceof BABYLON.Vector4)
            this.color = v1;
        else if (v2 !== undefined && v3 !== undefined) {
            if (v4 !== undefined) {
                this.color.x = v1
                this.color.y = v2
                this.color.z = v3
                this.color.w = v4
            } else {
                this.color.x = v1
                this.color.y = v2
                this.color.z = v3
                this.color.w = 1
            }
        } else {
            this.color.x = v1
            this.color.y = v1
            this.color.z = v1
            this.color.w = v1
        }
    }

    setUniforms(renderer: Renderer, options: PhongMaterialRenderParameters) {
        this.programs[renderer.id].setUniform(renderer, "uMMatrix", options.uMMatrix)
        this.programs[renderer.id].setUniform(renderer, "uVMatrix", options.uVMatrix)
        this.programs[renderer.id].setUniform(renderer, "uPMatrix", options.uPMatrix)

        this.programs[renderer.id].setUniform(renderer, "uVInvMatrix", options.uVInvMatrix)

        this.programs[renderer.id].setUniform(renderer, "uALight.color", options.ambientLight.color)

        this.programs[renderer.id].setUniform(renderer, "uNbPLights", options.pointLights.length)
        options.pointLights.forEach((light, idx) => {
            this.programs[renderer.id].setUniform(renderer, `uPLights[${idx}].pos`, light.pos)
            this.programs[renderer.id].setUniform(renderer, `uPLights[${idx}].color`, light.color)
            this.programs[renderer.id].setUniform(renderer, `uPLights[${idx}].intensity`, light.intensity)
        })

        this.programs[renderer.id].setUniform(renderer, "uNbSLights", options.spotLights.length)
        options.spotLights.forEach((light, idx) => {
            this.programs[renderer.id].setUniform(renderer, `uSLights[${idx}].pos`, light.pos)
            this.programs[renderer.id].setUniform(renderer, `uSLights[${idx}].dir`, light.dir)
            this.programs[renderer.id].setUniform(renderer, `uSLights[${idx}].aper`, light.aperture)
            this.programs[renderer.id].setUniform(renderer, `uSLights[${idx}].color`, light.color)
            this.programs[renderer.id].setUniform(renderer, `uSLights[${idx}].intensity`, light.intensity)
        })

        this.programs[renderer.id].setUniform(renderer, "uNormalMatrix", options.uNormalMatrix)

        this.programs[renderer.id].setUniform(renderer, "color", this.color)
        this.programs[renderer.id].setUniform(renderer, "diffuse", this.diffuse)
        this.programs[renderer.id].setUniform(renderer, "specular", this.specular)
        this.programs[renderer.id].setUniform(renderer, "shininess", this.shininess)
    }

    clone() {
        return new PhongMaterial({ color: this.color, diffuse: this.diffuse, specular: this.specular, shininess: this.shininess })
    }

}