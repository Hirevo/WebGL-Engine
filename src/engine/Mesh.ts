import { Vertex, Face, Program } from "./utils"
import { PointLight, AmbientLight, SpotLight } from "./Scene";
import { Geometry } from "./Geometry";
import { Material } from "./Material";
import { Renderer } from "./Renderer";
import { PhongMaterial } from "./materials/PhongMaterial";

interface BufferData {
    geometryNeedUpdate: boolean;
    materialNeedUpdate: boolean;
    vbuffer: WebGLBuffer;
    wvbuffer: WebGLBuffer;
    nbuffer: WebGLBuffer;
    wnbuffer: WebGLBuffer;
}

interface BufferDataList {
    [rendererId: string]: BufferData;
}

export class Mesh {

    visible = true;

    pos: BABYLON.Vector3;
    rot: BABYLON.Vector3;
    scl: BABYLON.Vector3;

    geometry: Geometry;
    material: Material;

    matricesNeedUpdate: boolean;

    protected bufferList: BufferDataList;

    protected uMMatrix: BABYLON.Matrix;
    protected uNormalMatrix: BABYLON.Matrix;

    constructor(geometry = new Geometry(), material: Material = new PhongMaterial()) {
        this.bufferList = {}
        this.geometry = geometry;
        this.material = material;
        this.pos = BABYLON.Vector3.Zero();
        this.rot = BABYLON.Vector3.Zero();
        this.scl = new BABYLON.Vector3(1, 1, 1);
        this.matricesNeedUpdate = true;
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

    forward(distance: number, bias = BABYLON.Vector3.Zero()) {
        let rot = BABYLON.Matrix.Identity()
            .multiply(BABYLON.Matrix.RotationX(this.rot.x + bias.x))
            .multiply(BABYLON.Matrix.RotationY(this.rot.y + bias.y))
            .multiply(BABYLON.Matrix.RotationZ(this.rot.z + bias.z))
        this.translate(BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.Forward(), rot).normalize().multiplyByFloats(distance, distance, distance));
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

    requestGeometryUpdate(state: boolean) {
        for (let key in this.bufferList)
            if (this.bufferList.hasOwnProperty(key)) {
                this.bufferList[key].geometryNeedUpdate = state;
            }
    }

    requstMaterialUpdate(state: boolean) {
        for (let key in this.bufferList)
            if (this.bufferList.hasOwnProperty(key)) {
                this.bufferList[key].materialNeedUpdate = state;
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
        this.geometry.computeVertexNormals()
        this.requestGeometryUpdate(true)
    }

    genBuffers(renderer: Renderer) {
        let size = this.geometry.faces.length * 3 * 3;
        let varray: number[] = []
        let narray: number[] = []
        let wvarray: number[] = []
        let wnarray: number[] = []

        if (this.bufferList[renderer.id] === undefined)
            this.bufferList[renderer.id] = { materialNeedUpdate: true, geometryNeedUpdate: true } as BufferData;
        else {
            renderer.gl.deleteBuffer(this.bufferList[renderer.id].vbuffer)
            renderer.gl.deleteBuffer(this.bufferList[renderer.id].nbuffer)
            renderer.gl.deleteBuffer(this.bufferList[renderer.id].wvbuffer)
            renderer.gl.deleteBuffer(this.bufferList[renderer.id].wnbuffer)
        }

        this.geometry.faces.forEach((face, idx) => {
            let faces = [[...face.v1.pos.asArray()], [...face.v2.pos.asArray()], [...face.v3.pos.asArray()]]
            let normal = [...face.normal.asArray()]
            let normals: number[][]

            if (this.geometry.vertexNormalsComputed)
                normals = [[...face.v1.normal.asArray()], [...face.v2.normal.asArray()], [...face.v3.normal.asArray()]]
            else
                normals = [normal, normal, normal]

            varray.push(...faces[0], ...faces[1], ...faces[2])
            wvarray.push(...faces[0], ...faces[1], ...faces[1], ...faces[2], ...faces[2], ...faces[0])
            narray.push(...normals[0], ...normals[1], ...normals[2])
            wnarray.push(...normals[0], ...normals[1], ...normals[1], ...normals[2], ...normals[2], ...normals[0])
        })

        let vbuffer = renderer.gl.createBuffer()
        if (vbuffer === null)
            throw "Couldn't create buffer"
        this.bufferList[renderer.id].vbuffer = vbuffer

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].vbuffer)
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(varray), renderer.gl.STATIC_DRAW)
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null)

        let nbuffer = renderer.gl.createBuffer()
        if (nbuffer === null)
            throw "Couldn't create buffer"
        this.bufferList[renderer.id].nbuffer = nbuffer

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].nbuffer)
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(narray), renderer.gl.STATIC_DRAW)
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null)

        let wvbuffer = renderer.gl.createBuffer()
        if (wvbuffer === null)
            throw "Couldn't create buffer"
        this.bufferList[renderer.id].wvbuffer = wvbuffer

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].wvbuffer)
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(wvarray), renderer.gl.STATIC_DRAW)
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null)

        let wnbuffer = renderer.gl.createBuffer()
        if (wnbuffer === null)
            throw "Couldn't create buffer"
        this.bufferList[renderer.id].wnbuffer = wnbuffer

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].wnbuffer)
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(wnarray), renderer.gl.STATIC_DRAW)
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null)

        this.bufferList[renderer.id].geometryNeedUpdate = false;
    }

    updateMaterial(renderer: Renderer) {
        this.material.initProgram(renderer);
        this.bufferList[renderer.id].materialNeedUpdate = false;
    }

    display(renderer: Renderer, uVMatrix: BABYLON.Matrix, uPMatrix: BABYLON.Matrix, uVInvMatrix: BABYLON.Matrix, pointLights: PointLight[], spotLights: SpotLight[], ambientLight: AmbientLight) {
        if (!this.visible)
            return;
        if (this.matricesNeedUpdate)
            this.updateMatrices();
        if (this.bufferList[renderer.id] === undefined || this.bufferList[renderer.id].geometryNeedUpdate)
            this.genBuffers(renderer);
        if (this.bufferList[renderer.id].materialNeedUpdate)
            this.updateMaterial(renderer);

        let materialOptions = {
            uMMatrix: this.uMMatrix,
            uVMatrix,
            uPMatrix,
            uVInvMatrix,
            uNormalMatrix: this.uNormalMatrix,
            pointLights,
            spotLights,
            ambientLight
        }

        this.material.bind(renderer)
        this.material.setUniforms(renderer, materialOptions)

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, (renderer.getMode() == renderer.gl.LINES) ? this.bufferList[renderer.id].wvbuffer : this.bufferList[renderer.id].vbuffer)
        renderer.gl.vertexAttribPointer(0, 3, renderer.gl.FLOAT, false, 0, 0)
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null)

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, (renderer.getMode() == renderer.gl.LINES) ? this.bufferList[renderer.id].wnbuffer : this.bufferList[renderer.id].nbuffer)
        renderer.gl.vertexAttribPointer(1, 3, renderer.gl.FLOAT, false, 0, 0)
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null)

        renderer.gl.enableVertexAttribArray(0)
        renderer.gl.enableVertexAttribArray(1)

        renderer.gl.drawArrays(renderer.getMode(), 0, ((renderer.getMode() == renderer.gl.LINES) ? 2 : 1) * this.geometry.faces.length * 3)

        renderer.gl.disableVertexAttribArray(1)
        renderer.gl.disableVertexAttribArray(0)

        this.material.unbind(renderer)
    }

    static loadObj(file: string, material?: Material) {
        let mesh = new Mesh(undefined, material);

        let fList: { v1: number, v2: number, v3: number }[] = [];

        file.split("\n").forEach(line => {
            let tab = line.replace(/\s+/g, " ").trim().split(" ");
            if (tab[0] == "v")
                mesh.geometry.addVertex(new BABYLON.Vector3(parseFloat(tab[1]), parseFloat(tab[2]), parseFloat(tab[3])));
            else if (tab[0] == "f")
                fList.push({ v1: parseInt(tab[1]) - 1, v2: parseInt(tab[2]) - 1, v3: parseInt(tab[3]) - 1 });
        })

        fList.forEach(face => mesh.geometry.addFace(face.v1, face.v2, face.v3));

        mesh.requestGeometryUpdate(true);

        return mesh
    }

    static async loadObjAsync(file: string, material?: Material) {
        let mesh = new Mesh(undefined, material);

        let fList: { v1: number, v2: number, v3: number }[] = [];

        file.split("\n").forEach(line => {
            let tab = line.replace(/\s+/g, " ").trim().split(" ");
            if (tab[0] == "v")
                mesh.geometry.addVertex(new BABYLON.Vector3(parseFloat(tab[1]), parseFloat(tab[2]), parseFloat(tab[3])));
            else if (tab[0] == "f")
                fList.push({ v1: parseInt(tab[1]) - 1, v2: parseInt(tab[2]) - 1, v3: parseInt(tab[3]) - 1 });
        })

        fList.forEach(face => mesh.geometry.addFace(face.v1, face.v2, face.v3));

        mesh.requestGeometryUpdate(true);

        return mesh
    }
}
