import * as BABYLON from "babylonjs"
import { Vertex, Face, Program } from "./utils"
import XHR from "./request"
import gl from "./index"
import { PointLight, AmbientLight } from "./scene";

export default class Mesh {

    specular = 0;
    shininess = 1;
    diffuse = 1;

    private matricesNeedUpdate: boolean;
    private buffersNeedUpdate: boolean;
    private vertexNormalsComputed: boolean;

    private vertices: Vertex[];
    private faces: Face[];

    private vbuffer: WebGLBuffer;
    private wvbuffer: WebGLBuffer;
    private nbuffer: WebGLBuffer;
    private wnbuffer: WebGLBuffer;

    private program: Program;

    private color: BABYLON.Vector4;
    private uMMatrix: BABYLON.Matrix;
    private uNormalMatrix: BABYLON.Matrix;
    private pos: BABYLON.Vector3;
    private rot: BABYLON.Vector3;
    private scl: BABYLON.Vector3;

    constructor() {
        this.matricesNeedUpdate = true
        this.buffersNeedUpdate = false
        this.vertexNormalsComputed = false
        this.vertices = []
        this.faces = []
        this.color = new BABYLON.Vector4(0, 0, 0, 1)
        this.pos = BABYLON.Vector3.Zero()
        this.rot = BABYLON.Vector3.Zero()
        this.scl = new BABYLON.Vector3(1, 1, 1)
    }

    addVertex(pos: BABYLON.Vector3, normal = BABYLON.Vector3.Zero()) {
        this.vertices.push({ pos, normal })
    }

    addFace(v1: number, v2: number, v3: number, normal?: BABYLON.Vector3) {
        let edge1 = this.vertices[v2].pos.subtract(this.vertices[v1].pos)
        let edge2 = this.vertices[v3].pos.subtract(this.vertices[v1].pos)

        if (normal === undefined)
            normal = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(edge1, edge2))

        this.faces.push({
            v1: this.vertices[v1],
            v2: this.vertices[v2],
            v3: this.vertices[v3],
            normal: normal
        })
    }

    addShaders(vertexShader: string, fragmentShader: string) {
        this.program = new Program(vertexShader, fragmentShader)
    }

    setNormal(idx: number, normal: BABYLON.Vector3) {
        this.vertices[idx].normal = normal
    }

    translate(v1: number | BABYLON.Vector3, v2 = 0, v3 = 0) {
        if (v1 instanceof BABYLON.Vector3)
            this.pos.addInPlace(v1)
        else
            this.pos.addInPlace(new BABYLON.Vector3(v1, v2, v3))
        this.matricesNeedUpdate = true
    }

    translateX(distance: number) {
        this.pos.x += distance
        this.matricesNeedUpdate = true
    }

    translateY(distance: number) {
        this.pos.y += distance
        this.matricesNeedUpdate = true
    }

    translateZ(distance: number) {
        this.pos.z += distance
        this.matricesNeedUpdate = true
    }

    scale(v1: number | BABYLON.Vector3, v2 = v1, v3 = v1) {
        if (v1 instanceof BABYLON.Vector3)
            this.scl.multiplyInPlace(v1)
        else
            this.scl.multiplyInPlace(new BABYLON.Vector3(v1, v2 as number, v3 as number))
        this.matricesNeedUpdate = true
    }

    scaleX(scale: number) {
        this.scl.x *= scale
        this.matricesNeedUpdate = true
    }

    scaleY(scale: number) {
        this.scl.y *= scale
        this.matricesNeedUpdate = true
    }

    scaleZ(scale: number) {
        this.scl.z *= scale
        this.matricesNeedUpdate = true
    }

    rotate(v1: number, v2: number, v3: number) {
        this.rot.x += v1
        this.rot.y += v2
        this.rot.z += v3
        this.matricesNeedUpdate = true
    }

    rotateX(angle: number) {
        this.rot.x += angle
        this.matricesNeedUpdate = true
    }

    rotateY(angle: number) {
        this.rot.y += angle
        this.matricesNeedUpdate = true
    }

    rotateZ(angle: number) {
        this.rot.z += angle
        this.matricesNeedUpdate = true
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

    updateMatrices() {
        this.uMMatrix = BABYLON.Matrix.Identity()
        this.uMMatrix = BABYLON.Matrix.Translation(this.pos.x, this.pos.y, this.pos.z).multiply(this.uMMatrix)
        this.uMMatrix = BABYLON.Matrix.Scaling(this.scl.x, this.scl.y, this.scl.z).multiply(this.uMMatrix)
        this.uMMatrix = BABYLON.Matrix.RotationX(this.rot.x).multiply(this.uMMatrix)
        this.uMMatrix = BABYLON.Matrix.RotationY(this.rot.y).multiply(this.uMMatrix)
        this.uMMatrix = BABYLON.Matrix.RotationZ(this.rot.z).multiply(this.uMMatrix)
        this.uNormalMatrix = BABYLON.Matrix.Transpose(BABYLON.Matrix.Invert(this.uMMatrix))
        this.matricesNeedUpdate = false
    }

    computeVertexNormals() {
        let computed: Vertex[] = [];
        this.vertices.forEach(vertex => {
            let found;
            if ((found = computed.find(elem => elem.pos.equals(vertex.pos))) != undefined) {
                vertex.normal = found.normal
                return;
            }
            let faces = this.faces.filter((face) => face.v1.pos.equals(vertex.pos) || face.v2.pos.equals(vertex.pos) || face.v3.pos.equals(vertex.pos))
            let avg = BABYLON.Vector3.Zero()
            faces.forEach(face => avg.addInPlace(face.normal))
            vertex.normal = avg.normalize()
            computed.push({ pos: vertex.pos, normal: vertex.normal })
        })
        this.vertexNormalsComputed = true
        this.buffersNeedUpdate = true
    }

    genBuffers() {
        let size = this.faces.length * 3 * 3;
        let varray: number[] = []
        let narray: number[] = []
        let wvarray: number[] = []
        let wnarray: number[] = []

        gl.deleteBuffer(this.vbuffer)
        gl.deleteBuffer(this.nbuffer)

        this.faces.forEach((face, idx) => {
            let faces = [[...face.v1.pos.asArray()], [...face.v2.pos.asArray()], [...face.v3.pos.asArray()]]
            let normal = [...face.normal.asArray()]
            let normals: number[][]

            if (this.vertexNormalsComputed)
                normals = [[...face.v1.normal.asArray()], [...face.v2.normal.asArray()], [...face.v3.normal.asArray()]]
            else
                normals = [normal, normal, normal]

            varray.push(...faces[0], ...faces[1], ...faces[2])
            wvarray.push(...faces[0], ...faces[1], ...faces[1], ...faces[2], ...faces[2], ...faces[0])
            narray.push(...normals[0], ...normals[1], ...normals[2])
            wnarray.push(...normals[0], ...normals[1], ...normals[1], ...normals[2], ...normals[2], ...normals[0])
        })

        let vbuffer = gl.createBuffer()
        if (vbuffer === null)
            throw "Couldn't create buffer"
        this.vbuffer = vbuffer

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(varray), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        let nbuffer = gl.createBuffer()
        if (nbuffer === null)
            throw "Couldn't create buffer"
        this.nbuffer = nbuffer

        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(narray), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

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

    display(mode: number, uVMatrix: BABYLON.Matrix, uPMatrix: BABYLON.Matrix, uVInvMatrix: BABYLON.Matrix, pointLights: PointLight[], ambientLight: AmbientLight) {
        if (this.matricesNeedUpdate)
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
        this.program.setUniform("uVInvMatrix", uVInvMatrix)

        this.program.setUniform("uALight.color", ambientLight.color)

        this.program.setUniform("uNbPLights", pointLights.length)
        pointLights.forEach((light, idx) => {
            this.program.setUniform(`uPLights[${idx}].pos`, light.pos)
            this.program.setUniform(`uPLights[${idx}].color`, light.color)
        })

        this.program.setUniform("uNormalMatrix", this.uNormalMatrix)

        this.program.setUniform("color", this.color)
        this.program.setUniform("diffuse", this.diffuse)
        this.program.setUniform("specular", this.specular)
        this.program.setUniform("shininess", this.shininess)

        gl.drawArrays(mode, 0, ((mode == gl.LINES) ? 2 : 1) * this.faces.length * 3)

        gl.disableVertexAttribArray(1)
        gl.disableVertexAttribArray(0)

        this.program.unbind()
    }

    static loadObj(path: string) {
        let mesh = new Mesh()

        let file = XHR.sync(path)
        if (!file)
            return;
        let fList: { v1: number, v2: number, v3: number }[] = []

        file.split("\n").forEach(line => {
            let tab = line.replace(/\s+/g, " ").trim().split(" ")
            if (tab[0] == "v")
                mesh.addVertex(new BABYLON.Vector3(parseFloat(tab[1]), parseFloat(tab[2]), parseFloat(tab[3])))
            else if (tab[0] == "f")
                fList.push({ v1: parseInt(tab[1]) - 1, v2: parseInt(tab[2]) - 1, v3: parseInt(tab[3]) - 1 })
        })

        fList.forEach(face => mesh.addFace(face.v1, face.v2, face.v3))

        mesh.genBuffers()

        return mesh
    }
}