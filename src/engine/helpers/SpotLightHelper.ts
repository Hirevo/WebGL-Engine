import { Mesh } from "../Mesh"
import { PointLight, SpotLight, AmbientLight } from "../Scene";
import { SphereGeometry } from "../geometries/SphereGeometry";
import { Vertex } from "../utils";
import { Geometry } from "../Geometry";
import { BasicMaterial } from "../materials/BaseMaterial";
import { Renderer } from "../Renderer";

export class SpotLightHelper extends Mesh {

    private tip: Vertex;
    private light: SpotLight;

    constructor(light: SpotLight) {
        super(undefined, new BasicMaterial(light.color));

        this.light = light;

        this.geometry.addVertex(new BABYLON.Vector3(0, 0, 0))
        this.geometry.addVertex(new BABYLON.Vector3(light.dir.x, light.dir.y, light.dir.z));
        this.tip = this.geometry.getVertex(1) as Vertex;

        this.geometry.addFace(0, 1, 0);

        this.pos = light.pos;
    }

    genBuffers(renderer: Renderer) {
        const size = this.geometry.faces.length * 3 * 3;
        const wvarray: number[] = [];
        const wnarray: number[] = [];

        if (this.bufferList[renderer.id] === undefined)
            this.bufferList[renderer.id] = { materialNeedUpdate: true, geometryNeedUpdate: true } as any;
        else {
            renderer.gl.deleteBuffer(this.bufferList[renderer.id].wvbuffer);
            renderer.gl.deleteBuffer(this.bufferList[renderer.id].wnbuffer);
        }

        this.geometry.faces.forEach((face, idx) => {
            const faces = [[...face.v1.pos.asArray()], [...face.v2.pos.asArray()], [...face.v3.pos.asArray()]];
            const normal = [...face.normal.asArray()];
            const normals: number[][] =
                (this.geometry.vertexNormalsComputed)
                    ? [[...face.v1.normal.asArray()], [...face.v2.normal.asArray()], [...face.v3.normal.asArray()]]
                    : [normal, normal, normal];

            wvarray.push(...faces[0], ...faces[1], ...faces[1], ...faces[2], ...faces[2], ...faces[0]);
            wnarray.push(...normals[0], ...normals[1], ...normals[1], ...normals[2], ...normals[2], ...normals[0]);
        });

        const wvbuffer = renderer.gl.createBuffer();
        if (wvbuffer === null)
            throw "Couldn't create buffer";
        this.bufferList[renderer.id].wvbuffer = wvbuffer;

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].wvbuffer);
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(wvarray), renderer.gl.STATIC_DRAW);
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null);

        const wnbuffer = renderer.gl.createBuffer();
        if (wnbuffer === null)
            throw "Couldn't create buffer";
        this.bufferList[renderer.id].wnbuffer = wnbuffer;

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].wnbuffer);
        renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, new Float32Array(wnarray), renderer.gl.STATIC_DRAW);
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null);

        this.bufferList[renderer.id].geometryNeedUpdate = false;
    }

    display(renderer: Renderer, uVMatrix: BABYLON.Matrix, uPMatrix: BABYLON.Matrix, uVInvMatrix: BABYLON.Matrix, pointLights: PointLight[], spotLights: SpotLight[], ambientLight: AmbientLight) {
        if (!this.tip.pos.equals(this.light.dir)) {
            this.requestGeometryUpdate(true);
            this.tip.pos.x = this.light.dir.x;
            this.tip.pos.y = this.light.dir.y;
            this.tip.pos.z = this.light.dir.z;
            this.updateMatrices();
        }
        if (this.bufferList[renderer.id] === undefined || this.bufferList[renderer.id].geometryNeedUpdate)
            this.genBuffers(renderer);
        if (this.bufferList[renderer.id].materialNeedUpdate)
            this.updateMaterial(renderer);

        this.material.bind(renderer);

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].wvbuffer);
        renderer.gl.vertexAttribPointer(0, 3, renderer.gl.FLOAT, false, 0, 0);
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null);

        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, this.bufferList[renderer.id].wnbuffer);
        renderer.gl.vertexAttribPointer(1, 3, renderer.gl.FLOAT, false, 0, 0);
        renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, null);

        renderer.gl.enableVertexAttribArray(0);
        renderer.gl.enableVertexAttribArray(1);

        this.material.setUniforms(renderer, { uMMatrix: this.uMMatrix, uVMatrix, uPMatrix });

        renderer.gl.drawArrays(renderer.gl.LINES, 0, 2 * this.geometry.faces.length * 3);

        renderer.gl.disableVertexAttribArray(1);
        renderer.gl.disableVertexAttribArray(0);

        this.material.unbind(renderer);
    }
}