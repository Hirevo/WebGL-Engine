import { Mesh } from "../Mesh"
import { PointLight, SpotLight, AmbientLight } from "../Scene";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { Renderer } from "../Renderer";
import { BasicMaterial } from "../materials/BaseMaterial";

export class PointLightHelper extends Mesh {

    private currentPos: BABYLON.Vector3;

    constructor(light: PointLight) {
        super(new SphereGeometry(2, 20), new BasicMaterial(light.color));

        // this.geometry.addVertex(new BABYLON.Vector3(3, 0, 0))
        // this.geometry.addVertex(new BABYLON.Vector3(-3, 0, 0))
        // this.geometry.addVertex(new BABYLON.Vector3(0, 3, 0))
        // this.geometry.addVertex(new BABYLON.Vector3(0, -3, 0))
        // this.geometry.addVertex(new BABYLON.Vector3(0, 0, 3))
        // this.geometry.addVertex(new BABYLON.Vector3(0, 0, -3))

        // this.geometry.addFace(0, 2, 4)
        // this.geometry.addFace(0, 3, 4)
        // this.geometry.addFace(0, 2, 5)
        // this.geometry.addFace(0, 3, 5)
        // this.geometry.addFace(1, 2, 4)
        // this.geometry.addFace(1, 3, 4)
        // this.geometry.addFace(1, 2, 5)
        // this.geometry.addFace(1, 3, 5)

        this.pos = light.pos;
        this.currentPos = this.pos.clone();
    }

    display(renderer: Renderer, uVMatrix: BABYLON.Matrix, uPMatrix: BABYLON.Matrix, uVInvMatrix: BABYLON.Matrix, pointLights: PointLight[], spotLights: SpotLight[], ambientLight: AmbientLight) {
        if (!this.currentPos.equals(this.pos)) {
            this.currentPos = this.pos.clone();
            this.updateMatrices();
        }
        super.display(renderer, uVMatrix, uPMatrix, uVInvMatrix, pointLights, spotLights, ambientLight);
    }
}