import { Geometry } from "../Geometry"

export class TorusKnotGeometry extends Geometry {
    constructor(radius = 10, tube = 5, p = 2, q = 3, tubeSegments = 300, radialSegments = 50) {
        super()

        function getCurvePos(i: number, p: number, q: number, rad: number) {
            const v = new BABYLON.Vector3(0, 0, 0);
            const tmp = q / p * i;

            v.x = rad * (2 + Math.cos(tmp)) * 0.5 * Math.cos(i);
            v.y = rad * (2 + Math.cos(tmp)) * 0.5 * Math.sin(i);
            v.z = rad * 0.5 * Math.sin(tmp);
            return (v);
        }

        for (let i = 0; i <= tubeSegments; i++) {
            const u = i / tubeSegments * p * Math.PI * 2;
            const p1 = getCurvePos(u, p, q, radius);
            const p2 = getCurvePos(u + 0.01, p, q, radius);

            const T = p2.subtract(p1);
            const M = p2.add(p1);
            const B = BABYLON.Vector3.Cross(T, M);
            const N = BABYLON.Vector3.Cross(B, T);

            B.normalize();
            N.normalize();

            for (let j = 0; j <= radialSegments; j++) {
                const v = j / radialSegments * Math.PI * 2;
                const cx = - tube * Math.cos(v);
                const cy = tube * Math.sin(v);
                const x = p1.x + (cx * N.x + cy * B.x);
                const y = p1.y + (cx * N.y + cy * B.y);
                const z = p1.z + (cx * N.z + cy * B.z);

                const vertex = new BABYLON.Vector3(x, y, z);
                const normal = vertex.subtract(p1).normalize();

                this.addVertex(vertex, normal);
            }
        }

        for (let i = 1; i <= tubeSegments; i++) {
            for (let j = 1; j <= radialSegments; j++) {
                const a = (radialSegments + 1) * (i - 1) + (j - 1);
                const b = (radialSegments + 1) * i + (j - 1);
                const c = (radialSegments + 1) * i + j;
                const d = (radialSegments + 1) * (i - 1) + j;

                this.addFace(a, b, d);
                this.addFace(b, c, d);
            }
        }

        this.vertexNormalsComputed = true;
    }
}