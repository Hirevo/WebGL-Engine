import Geometry from "../Geometry";

export default class PlaneGeometry extends Geometry {
    constructor() {
        super()

        this.addVertex(new BABYLON.Vector3(-1000, 0, -1000), BABYLON.Vector3.Up())
        this.addVertex(new BABYLON.Vector3(1000, 0, -1000), BABYLON.Vector3.Up())
        this.addVertex(new BABYLON.Vector3(-1000, 0, 1000), BABYLON.Vector3.Up())
        this.addVertex(new BABYLON.Vector3(1000, 0, 1000), BABYLON.Vector3.Up())

        this.addFace(0, 1, 2, BABYLON.Vector3.Up())
        this.addFace(1, 2, 3, BABYLON.Vector3.Up())

        this.vertexNormalsComputed = true
    }
}