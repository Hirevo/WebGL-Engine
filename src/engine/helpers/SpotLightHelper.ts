import Mesh from "../Mesh"
import { PointLight, SpotLight, AmbientLight } from "../Scene";
import { XHR } from "../../request";
import gl from "../../index";
import SphereGeometry from "../geometries/SphereGeometry";
import { Vertex } from "../utils";
import Geometry from "../Geometry";

export default class SpotLightHelper extends Mesh {

    private tip: Vertex;
    private light: SpotLight;

    constructor(light: SpotLight) {
        super()

        this.light = light

        this.geometry.addVertex(new BABYLON.Vector3(0, 0, 0))
        this.geometry.addVertex(new BABYLON.Vector3(light.dir.x, light.dir.y, light.dir.z))
        this.tip = this.geometry.getVertex(1) as Vertex

        this.geometry.addFace(0, 1, 0)

        this.pos = light.pos
        this.setColor(light.color)
        this.genBuffers()
        let vertexShader = XHR.sync("shaders/helpers/pointLightHelper/vert.vs")
        let fragmentShader = XHR.sync("shaders/helpers/pointLightHelper/frag.fs")
        if (vertexShader === undefined || fragmentShader === undefined)
            throw "LoadingError"
        this.addShaders(vertexShader, fragmentShader)
    }

    genBuffers() {
        let size = this.geometry.faces.length * 3 * 3;
        let wvarray: number[] = []
        let wnarray: number[] = []

        gl.deleteBuffer(this.vbuffer)
        gl.deleteBuffer(this.nbuffer)
        gl.deleteBuffer(this.wvbuffer)
        gl.deleteBuffer(this.wnbuffer)

        this.geometry.faces.forEach((face, idx) => {
            let faces = [[...face.v1.pos.asArray()], [...face.v2.pos.asArray()], [...face.v3.pos.asArray()]]
            let normal = [...face.normal.asArray()]
            let normals: number[][]

            if (this.geometry.vertexNormalsComputed)
                normals = [[...face.v1.normal.asArray()], [...face.v2.normal.asArray()], [...face.v3.normal.asArray()]]
            else
                normals = [normal, normal, normal]

            wvarray.push(...faces[0], ...faces[1], ...faces[1], ...faces[2], ...faces[2], ...faces[0])
            wnarray.push(...normals[0], ...normals[1], ...normals[1], ...normals[2], ...normals[2], ...normals[0])
        })

        let wvbuffer = gl.createBuffer()
        if (wvbuffer === null)
            throw "Couldn't create buffer"
        this.wvbuffer = wvbuffer

        gl.bindBuffer(gl.ARRAY_BUFFER, this.wvbuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wvarray), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        let wnbuffer = gl.createBuffer()
        if (wnbuffer === null)
            throw "Couldn't create buffer"
        this.wnbuffer = wnbuffer

        gl.bindBuffer(gl.ARRAY_BUFFER, this.wnbuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wnarray), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.buffersNeedUpdate = false
    }

    display(mode: number, uVMatrix: BABYLON.Matrix, uPMatrix: BABYLON.Matrix, uVInvMatrix: BABYLON.Matrix, pointLights: PointLight[], spotLights: SpotLight[], ambientLight: AmbientLight) {
        if (!this.tip.pos.equals(this.light.dir)) {
            this.buffersNeedUpdate = true;
            this.tip.pos.x = this.light.dir.x;
            this.tip.pos.y = this.light.dir.y;
            this.tip.pos.z = this.light.dir.z;
            this.updateMatrices()
        }
        if (this.buffersNeedUpdate)
            this.genBuffers()

        this.program.bind()

        gl.bindBuffer(gl.ARRAY_BUFFER, this.wvbuffer)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.wnbuffer)
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.enableVertexAttribArray(0)
        gl.enableVertexAttribArray(1)

        this.program.setUniform("uMMatrix", this.uMMatrix)
        this.program.setUniform("uVMatrix", uVMatrix)
        this.program.setUniform("uPMatrix", uPMatrix)

        this.program.setUniform("color", this.color)

        gl.drawArrays(gl.LINES, 0, 2 * this.geometry.faces.length * 3)

        gl.disableVertexAttribArray(1)
        gl.disableVertexAttribArray(0)

        this.program.unbind()
    }
}