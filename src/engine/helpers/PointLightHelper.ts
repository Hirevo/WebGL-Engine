import { Mesh } from "../Mesh"
import { PointLight, SpotLight, AmbientLight } from "../Scene";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { Renderer } from "../Renderer";
import { BasicMaterial } from "../materials/BaseMaterial";

export class PointLightHelper extends Mesh {

    private currentPos: BABYLON.Vector3;

    constructor(light: PointLight) {
        super(new SphereGeometry(2, 10), new BasicMaterial(light.color));

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
        if (this.bufferList[renderer.id] === undefined || this.bufferList[renderer.id].geometryNeedUpdate)
            this.genBuffers(renderer);
        if (this.bufferList[renderer.id].materialNeedUpdate)
            this.updateMaterial(renderer);

        this.material.bind(renderer);

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, (renderer.getMode() == renderer.gl.LINES) ? this.bufferList[renderer.id].wvbuffer : this.bufferList[renderer.id].vbuffer);
        renderer.gl.vertexAttribPointer(0, 3, renderer.gl.FLOAT, false, 0, 0);
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null);

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, (renderer.getMode() == renderer.gl.LINES) ? this.bufferList[renderer.id].wnbuffer : this.bufferList[renderer.id].nbuffer);
        renderer.gl.vertexAttribPointer(1, 3, renderer.gl.FLOAT, false, 0, 0);
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null);

        this.material.setUniforms(renderer, { uMMatrix: this.uMMatrix, uVMatrix, uPMatrix });

        renderer.gl.drawArrays(renderer.getMode(), 0, ((renderer.getMode() == renderer.gl.LINES) ? 2 : 1) * this.geometry.faces.length * 3);

        this.material.unbind(renderer);
    }
}