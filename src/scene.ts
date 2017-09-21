import * as BABYLON from "babylonjs"
import Mesh from "./mesh"
import gl from "./index"

export interface PointLight {
    pos: BABYLON.Vector4;
    color: BABYLON.Vector4;
}

export interface AmbientLight {
    color: BABYLON.Vector4;
}

export default class Scene {


    uVMatrix: BABYLON.Matrix;
    uPMatrix: BABYLON.Matrix;
    uVInvMatrix: BABYLON.Matrix;
    private viewNeedsUpdate: boolean;
    private meshes: Mesh[];
    private pointLights: PointLight[];
    private ambientLight: AmbientLight;
    private pos: BABYLON.Vector3;
    private rot: BABYLON.Vector3;
    private scl: BABYLON.Vector3;

    constructor() {
        this.viewNeedsUpdate = true
        this.meshes = []
        this.pos = BABYLON.Vector3.Zero()
        this.rot = BABYLON.Vector3.Zero()
        this.scl = new BABYLON.Vector3(1, 1, 1)
        this.pointLights = []
        this.ambientLight = { color: BABYLON.Vector4.Zero() }
    }

    addMesh(mesh: Mesh) {
        this.meshes.push(mesh)
    }

    getMesh(idx: number) {
        return this.meshes[idx]
    }

    addPointLight(pos: BABYLON.Vector3, color?: BABYLON.Vector4) {
        if (!color)
            color = new BABYLON.Vector4(1, 1, 1, 1)
        this.pointLights.push({ pos: new BABYLON.Vector4(pos.x, pos.y, pos.z, 1), color })
    }

    addAmbientLight(color: BABYLON.Vector4) {
        this.ambientLight = { color }
    }

    translate(v1: number | BABYLON.Vector3, v2 = 0, v3 = 0) {
        if (v1 instanceof BABYLON.Vector3)
            this.pos.addInPlace(v1)
        else
            this.pos.addInPlace(new BABYLON.Vector3(v1, v2, v3))
        this.viewNeedsUpdate = true
    }

    translateX(distance: number) {
        this.pos.x += distance
        this.viewNeedsUpdate = true
    }

    translateY(distance: number) {
        this.pos.y += distance
        this.viewNeedsUpdate = true
    }

    translateZ(distance: number) {
        this.pos.z += distance
        this.viewNeedsUpdate = true
    }

    scale(v1: number | BABYLON.Vector3, v2 = 1, v3 = 1) {
        if (v1 instanceof BABYLON.Vector3)
            this.scl.multiplyInPlace(v1)
        else
            this.scl.multiplyInPlace(new BABYLON.Vector3(v1, v2, v3))
        this.viewNeedsUpdate = true
    }

    scaleX(scale: number) {
        this.scl.x *= scale
        this.viewNeedsUpdate = true
    }

    scaleY(scale: number) {
        this.scl.y *= scale
        this.viewNeedsUpdate = true
    }

    scaleZ(scale: number) {
        this.scl.z *= scale
        this.viewNeedsUpdate = true
    }

    rotate(v1: number, v2: number, v3: number) {
        this.rot.x = v1
        this.rot.y = v2
        this.rot.z = v3
        this.viewNeedsUpdate = true
    }

    rotateX(angle: number) {
        this.rot.x += angle
        this.viewNeedsUpdate = true
    }

    rotateY(angle: number) {
        this.rot.y += angle
        this.viewNeedsUpdate = true
    }

    rotateZ(angle: number) {
        this.rot.z += angle
        this.viewNeedsUpdate = true
    }

    updateView() {
        this.uVMatrix = BABYLON.Matrix.Identity()
        this.uVMatrix = BABYLON.Matrix.Translation(this.pos.x, this.pos.y, this.pos.z).multiply(this.uVMatrix)
        this.uVMatrix = BABYLON.Matrix.Scaling(this.scl.x, this.scl.y, this.scl.z).multiply(this.uVMatrix)
        this.uVMatrix = BABYLON.Matrix.RotationX(this.rot.x).multiply(this.uVMatrix)
        this.uVMatrix = BABYLON.Matrix.RotationY(this.rot.y).multiply(this.uVMatrix)
        this.uVMatrix = BABYLON.Matrix.RotationZ(this.rot.z).multiply(this.uVMatrix)
        this.uPMatrix = BABYLON.Matrix.PerspectiveFovRH(45, window.innerWidth / window.innerHeight, 0.1, 10000)
        this.uVInvMatrix = BABYLON.Matrix.Invert(this.uVMatrix)
        this.viewNeedsUpdate = false
        console.log("UPDATED VIEW MATRICES")
    }

    render(mode: number) {
        if (this.viewNeedsUpdate)
            this.updateView()
        this.meshes.forEach(mesh => mesh.display(mode, this.uVMatrix, this.uPMatrix, this.uVInvMatrix, this.pointLights, this.ambientLight))
    }
}