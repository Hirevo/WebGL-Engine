
interface CameraParameters {
    pos?: BABYLON.Vector3;
    target?: BABYLON.Vector3;
    fov?: number;
    aspectRatio?: number;
    near?: number;
    far?: number;
}

export class Camera {
    private cached: { pos: BABYLON.Vector3, target: BABYLON.Vector3 };

    uVMatrix: BABYLON.Matrix;
    uPMatrix: BABYLON.Matrix;
    uVInvMatrix: BABYLON.Matrix;

    private _pos: BABYLON.Vector3;
    get pos() { return this._pos; };
    set pos(value) { this._pos = value; this.matricesNeedUpdate = true };

    private _target: BABYLON.Vector3;
    get target() { return this._target; };
    set target(value) { this._target = value; this.matricesNeedUpdate = true };

    private _fov: number;
    get fov() { return this._fov; };
    set fov(value) { this._fov = value; this.matricesNeedUpdate = true };

    private _aspectRatio: number;
    get aspectRatio() { return this._aspectRatio; };
    set aspectRatio(value) { this._aspectRatio = value; this.matricesNeedUpdate = true };

    private _near: number;
    get near() { return this._near; };
    set near(value) { this._near = value; this.matricesNeedUpdate = true };

    private _far: number;
    get far() { return this._far; };
    set far(value) { this._far = value; this.matricesNeedUpdate = true };

    private _matricesNeedUpdate: boolean;
    get matricesNeedUpdate() { return this._matricesNeedUpdate || !this.cached.pos.equals(this.pos) || !this.cached.target.equals(this.target); };
    set matricesNeedUpdate(value) { this._matricesNeedUpdate = value; };

    constructor(options: CameraParameters = { pos: new BABYLON.Vector3(0, 0, 0), target: new BABYLON.Vector3(0, 0, 0), fov: 45, aspectRatio: 16 / 9, near: 0.1, far: 10000 }) {
        this.pos = (options.pos !== undefined) ? options.pos : new BABYLON.Vector3(0, 0, 0);
        this.target = (options.target !== undefined) ? options.target : new BABYLON.Vector3(0, 0, 0);
        this.cached = { pos: this.pos, target: this.target };
        this.fov = (options.fov !== undefined) ? options.fov : 45;
        this.aspectRatio = (options.aspectRatio !== undefined) ? options.aspectRatio : 16 / 9;
        this.near = (options.near !== undefined) ? options.near : 0.1;
        this.far = (options.far !== undefined) ? options.far : 10000;
        this.matricesNeedUpdate = true;
    }

    updateMatrices() {
        this.cached.pos = this.pos.clone();
        this.cached.target = this.target.clone();
        this.uVMatrix = BABYLON.Matrix.LookAtRH(this.pos, this.target, BABYLON.Vector3.Up());
        this.uPMatrix = BABYLON.Matrix.PerspectiveFovRH(this.fov, this.aspectRatio, this.near, this.far);
        this.uVInvMatrix = BABYLON.Matrix.Invert(this.uVMatrix);
        this.matricesNeedUpdate = false;
    }

    setDirection(dir: BABYLON.Vector3) {
        this.target = this.pos.add(dir);
    }

    lookAt(target: BABYLON.Vector3) {
        this.target = target;
    }

    setPosition(pos: BABYLON.Vector3) {
        this.pos = pos;
    }
}