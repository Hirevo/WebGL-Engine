import { Mesh } from "./Mesh"
import { Renderer } from "./Renderer";
import { Camera } from "./Camera";
import { Material, Program } from "./Engine";

export interface PointLight {
    pos: BABYLON.Vector3;
    color: BABYLON.Vector4;
    intensity: number;
}

export interface SpotLight {
    pos: BABYLON.Vector3;
    dir: BABYLON.Vector3;
    aperture: number;
    color: BABYLON.Vector4;
    intensity: number;
    lookAt: (target: BABYLON.Vector3) => void;
}

export interface AmbientLight {
    color: BABYLON.Vector4;
}

export interface SortedMeshes {
    [material: string]: Mesh[];
}

export class Scene {

    private meshes: Mesh[];
    private sortedMeshes: SortedMeshes;
    private pointLights: PointLight[];
    private spotLights: SpotLight[]
    private ambientLight: AmbientLight;

    constructor() {
        this.meshes = [];
        this.sortedMeshes = {};
        this.pointLights = [];
        this.spotLights = [];
        this.ambientLight = { color: BABYLON.Vector4.Zero() };
    }

    addMesh(mesh: Mesh) {
        this.meshes.push(mesh);
        if (this.sortedMeshes[mesh.material.identifier] === undefined)
            this.sortedMeshes[mesh.material.identifier] = [];
        this.sortedMeshes[mesh.material.identifier].push(mesh);
        return mesh;
    }

    getMesh(idx: number) {
        return this.meshes[idx];
    }

    removeMesh(idx: number) {
        const mesh = this.meshes.splice(idx, 1)[0];
        const arrIdx = this.sortedMeshes[mesh.material.identifier].indexOf(mesh);

        this.sortedMeshes[mesh.material.identifier].splice(arrIdx, 1);
        return mesh;
    }

    addPointLight(pos: BABYLON.Vector3, color = new BABYLON.Vector4(1, 1, 1, 1), intensity = 300) {
        const pointlight: PointLight = {
            pos: new BABYLON.Vector3(pos.x, pos.y, pos.z),
            color,
            intensity
        };
        this.pointLights.push(pointlight);
        return pointlight;
    }

    getPointLight(idx: number) {
        return this.pointLights[idx];
    }

    removePointLight(idx: number) {
        return this.pointLights.splice(idx, 1)[0];
    }

    addSpotLight(pos: BABYLON.Vector3, dir: BABYLON.Vector3, aperture: number, color = new BABYLON.Vector4(1, 1, 1, 1), intensity = 300) {
        const spotlight: SpotLight = {
            pos: new BABYLON.Vector3(pos.x, pos.y, pos.z),
            dir: new BABYLON.Vector3(dir.x, dir.y, dir.z),
            aperture,
            color,
            intensity,
            lookAt: function (target: BABYLON.Vector3) {
                let v = target.subtract(this.pos);
                this.dir.x = v.x;
                this.dir.y = v.y;
                this.dir.z = v.z;
            }
        }
        this.spotLights.push(spotlight);
        return spotlight;
    }

    getSpotLight(idx: number) {
        return this.spotLights[idx];
    }

    removeSpotLight(idx: number) {
        return this.spotLights.splice(idx, 1)[0];
    }

    addAmbientLight(color: BABYLON.Vector4) {
        this.ambientLight = { color };
        return this.ambientLight;
    }

    removeAmbientLight() {
        let old = this.ambientLight.color;
        this.ambientLight = { color: BABYLON.Vector4.Zero() };
        return old;
    }

    render(renderer: Renderer, camera: Camera) {
        if (camera.matricesNeedUpdate)
            camera.updateMatrices();
        for (const material in this.sortedMeshes) {
            if (renderer.programs[material] === undefined)
                this.sortedMeshes[material][0].material.initProgram(renderer);
            renderer.programs[material].bind(renderer);
            this.sortedMeshes[material].forEach(mesh => mesh.display(renderer, camera.uVMatrix, camera.uPMatrix, camera.uVInvMatrix, this.pointLights, this.spotLights, this.ambientLight));
            renderer.programs[material].unbind(renderer);
        }
    }
}