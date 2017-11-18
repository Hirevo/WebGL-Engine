
interface CameraParameters {
    pos?: BABYLON.Vector3;
    target?: BABYLON.Vector3;
    fov?: number;
    aspectRatio?: number;
    near?: number;
    far?: number;
}

export class Camera {

    pos: BABYLON.Vector3;
    target: BABYLON.Vector3;

    fov: number;
    aspectRatio: number;
    near: number;
    far: number;

    uVMatrix: BABYLON.Matrix;
    uPMatrix: BABYLON.Matrix;
    uVInvMatrix: BABYLON.Matrix;

    matricesNeedUpdate: boolean;

    constructor(options: CameraParameters = { pos: new BABYLON.Vector3(0, 0, 0), target: new BABYLON.Vector3(0, 0, 0), fov: 45, aspectRatio: 16 / 9, near: 0.1, far: 10000 }) {
        this.pos = (options.pos !== undefined) ? options.pos : new BABYLON.Vector3(0, 0, 0);
        this.target = (options.target !== undefined) ? options.target : new BABYLON.Vector3(0, 0, 0);
        this.fov = (options.fov !== undefined) ? options.fov : 45;
        this.aspectRatio = (options.aspectRatio !== undefined) ? options.aspectRatio : 16 / 9;
        this.near = (options.near !== undefined) ? options.near : 0.1;
        this.far = (options.far !== undefined) ? options.far : 10000;
        this.matricesNeedUpdate = true;
    }

    updateMatrices() {
        this.uVMatrix = BABYLON.Matrix.LookAtRH(this.pos, this.target, BABYLON.Vector3.Up());
        this.uPMatrix = BABYLON.Matrix.PerspectiveFovRH(this.fov, this.aspectRatio, this.near, this.far);
        this.uVInvMatrix = BABYLON.Matrix.Invert(this.uVMatrix);
        this.matricesNeedUpdate = false;
    }

    setDirection(dir: BABYLON.Vector3) {
        this.target = this.pos.add(dir);
        this.matricesNeedUpdate = true;
    }

    lookAt(target: BABYLON.Vector3) {
        this.target = target;
        this.matricesNeedUpdate = true;
    }

    setPosition(pos: BABYLON.Vector3) {
        this.pos = pos;
        this.matricesNeedUpdate = true;
    }
}