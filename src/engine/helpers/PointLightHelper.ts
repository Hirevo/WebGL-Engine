import * as BABYLON from "babylonjs"
import Mesh from "../Mesh"
import { PointLight, SpotLight, AmbientLight } from "../Scene";
import { XHR } from "../../request";
import { gl } from "../../index";
import SphereGeometry from "../geometries/SphereGeometry";

export default class PointLightHelper extends Mesh {

    constructor(light: PointLight) {
        super()

        this.geometry.addVertex(new BABYLON.Vector3(3, 0, 0))
        this.geometry.addVertex(new BABYLON.Vector3(-3, 0, 0))
        this.geometry.addVertex(new BABYLON.Vector3(0, 3, 0))
        this.geometry.addVertex(new BABYLON.Vector3(0, -3, 0))
        this.geometry.addVertex(new BABYLON.Vector3(0, 0, 3))
        this.geometry.addVertex(new BABYLON.Vector3(0, 0, -3))

        this.geometry.addFace(0, 2, 4)
        this.geometry.addFace(0, 3, 4)
        this.geometry.addFace(0, 2, 5)
        this.geometry.addFace(0, 3, 5)
        this.geometry.addFace(1, 2, 4)
        this.geometry.addFace(1, 3, 4)
        this.geometry.addFace(1, 2, 5)
        this.geometry.addFace(1, 3, 5)

        this.pos = light.pos
        this.setColor(light.color)
        this.genBuffers()
        let vertexShader = XHR.sync("shaders/helpers/pointLightHelper/vert.vs")
        let fragmentShader = XHR.sync("shaders/helpers/pointLightHelper/frag.fs")
        if (vertexShader === undefined || fragmentShader === undefined)
            throw "LoadingError"
        this.addShaders(vertexShader, fragmentShader)
    }

    display(mode: number, uVMatrix: BABYLON.Matrix, uPMatrix: BABYLON.Matrix, uVInvMatrix: BABYLON.Matrix, pointLights: PointLight[], spotLights: SpotLight[], ambientLight: AmbientLight) {
        // if (this.matricesNeedUpdate)
            this.updateMatrices()
        if (this.buffersNeedUpdate)
            this.genBuffers()

        this.program.bind()

        gl.bindBuffer(gl.ARRAY_BUFFER, (mode == gl.LINES) ? this.wvbuffer : this.vbuffer)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, (mode == gl.LINES) ? this.wnbuffer : this.nbuffer)
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.enableVertexAttribArray(0)
        gl.enableVertexAttribArray(1)

        this.program.setUniform("uMMatrix", this.uMMatrix)
        this.program.setUniform("uVMatrix", uVMatrix)
        this.program.setUniform("uPMatrix", uPMatrix)

        this.program.setUniform("color", this.color)

        gl.drawArrays(mode, 0, ((mode == gl.LINES) ? 2 : 1) * this.geometry.faces.length * 3)

        gl.disableVertexAttribArray(1)
        gl.disableVertexAttribArray(0)

        this.program.unbind()
    }
}