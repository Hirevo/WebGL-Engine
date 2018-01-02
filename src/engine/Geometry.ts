import { Vertex, Face } from "./utils";

export class Geometry {

    vertices: Vertex[];
    faces: Face[];
    vertexNormalsComputed: boolean;

    constructor() {
        this.vertices = [];
        this.faces = [];
        this.vertexNormalsComputed = false;
    }

    addVertex(pos: BABYLON.Vector3, normal = BABYLON.Vector3.Zero(), texCoords = BABYLON.Vector2.Zero()) {
        const vertex = { pos, normal, texCoords };

        this.vertices.push(vertex);
        return vertex;
    }

    getVertex(idx: number) {
        return (idx >= 0 && idx < this.vertices.length) ? this.vertices[idx] : undefined;
    }

    addFace(v1: number, v2: number, v3: number, normal?: BABYLON.Vector3, t1?: BABYLON.Vector2, t2?: BABYLON.Vector2, t3?: BABYLON.Vector2) {
        const edge1 = this.vertices[v2].pos.subtract(this.vertices[v1].pos);
        const edge2 = this.vertices[v3].pos.subtract(this.vertices[v1].pos);

        if (normal === undefined)
            normal = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(edge1, edge2));

        if (t1 === undefined)
            t1 = BABYLON.Vector2.Zero();
        if (t2 === undefined)
            t2 = BABYLON.Vector2.Zero();
        if (t3 === undefined)
            t3 = BABYLON.Vector2.Zero();

        const face = {
            v1: this.vertices[v1],
            v2: this.vertices[v2],
            v3: this.vertices[v3],
            normal: normal,
            t1: t1,
            t2: t2,
            t3: t3
        };

        this.faces.push(face);
        return face;
    }

    getFace(idx: number) {
        return (idx >= 0 && idx < this.faces.length) ? this.faces[idx] : undefined;
    }

    setNormal(idx: number, normal: BABYLON.Vector3) {
        if (idx >= 0 && idx < this.vertices.length)
            this.vertices[idx].normal = normal;
    }

    getNormal(idx: number) {
        return (idx >= 0 && idx < this.vertices.length) ? this.vertices[idx].normal : undefined;
    }

    computeVertexNormals() {
        const computed: Vertex[] = [];
        this.vertices.forEach(vertex => {
            let found;
            if ((found = computed.find(elem => elem.pos.equals(vertex.pos))) != undefined) {
                vertex.normal = found.normal;
                return;
            }
            const faces = this.faces.filter((face) => face.v1.pos.equals(vertex.pos) || face.v2.pos.equals(vertex.pos) || face.v3.pos.equals(vertex.pos));
            const avg = BABYLON.Vector3.Zero();
            faces.forEach(face => avg.addInPlace(face.normal));
            vertex.normal = avg.normalize();
            computed.push({ pos: vertex.pos, normal: vertex.normal });
        })
        this.vertexNormalsComputed = true;
    }
}