import * as BABYLON from "babylonjs"
import Mesh from "./Mesh"
import gl from "./../index"

export interface PointLight {
    pos: BABYLON.Vector3;
    color: BABYLON.Vector4;
}

export interface SpotLight {
    pos: BABYLON.Vector3;
    dir: BABYLON.Vector3;
    aperture: number;
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
    private spotLights: SpotLight[]
    private ambientLight: AmbientLight;
    target: BABYLON.Vector3 | BABYLON.Vector4;
    pos: BABYLON.Vector3;
    rot: BABYLON.Vector3;
    scl: BABYLON.Vector3;

    constructor() {
        this.viewNeedsUpdate = true
        this.meshes = []
        this.pos = BABYLON.Vector3.Zero()
        this.rot = BABYLON.Vector3.Zero()
        this.scl = new BABYLON.Vector3(1, 1, 1)
        this.target = BABYLON.Vector3.Zero()
        this.pointLights = []
        this.spotLights = []
        this.ambientLight = { color: BABYLON.Vector4.Zero() }
    }

    addMesh(mesh: Mesh) {
        this.meshes.push(mesh)
    }

    getMesh(idx: number) {
        return this.meshes[idx]
    }

    removeMesh(idx: number) {
        this.meshes.splice(idx, 1)
    }

    addPointLight(pos: BABYLON.Vector3, color?: BABYLON.Vector4) {
        if (!color)
            color = new BABYLON.Vector4(1, 1, 1, 1)
        this.pointLights.push({ pos: new BABYLON.Vector3(pos.x, pos.y, pos.z), color })
    }

    getPointLight(idx: number) {
        return this.pointLights[idx]
    }

    removePointLight(idx: number) {
        this.pointLights.splice(idx, 1)
    }

    addAmbientLight(color: BABYLON.Vector4) {
        this.ambientLight = { color }
    }

    removeAmbientLight() {
        this.ambientLight = { color: BABYLON.Vector4.Zero() }
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

    lookAt(target: BABYLON.Vector3 | BABYLON.Vector4) {
        this.target = target
        this.viewNeedsUpdate = true
    }

    cancelUpdates() {
        this.viewNeedsUpdate = false
    }

    updateView() {
        this.uVMatrix = BABYLON.Matrix.LookAtRH(this.pos, new BABYLON.Vector3(this.target.x, this.target.y, this.target.z), BABYLON.Vector3.Up())
        this.uPMatrix = BABYLON.Matrix.PerspectiveFovRH(45, window.innerWidth / window.innerHeight, 0.1, 10000)
        this.uVInvMatrix = BABYLON.Matrix.Invert(this.uVMatrix)
        this.viewNeedsUpdate = false
    }

    render(mode: number) {
        if (this.viewNeedsUpdate)
            this.updateView()
        this.meshes.forEach(mesh => mesh.display(mode, this.uVMatrix, this.uPMatrix, this.uVInvMatrix, this.pointLights, this.spotLights, this.ambientLight))
    }
}