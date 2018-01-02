import { Geometry } from "../Geometry";
import { Vertex } from "../utils";

export class PlaneGeometry extends Geometry {

    grid: Vertex[][];

    constructor(lengthX: number, lengthY = lengthX, res = 2) {
        super();

        const stepX = lengthX / res;
        const stepY = lengthY / res;
        const tX = lengthX / 2;
        const tY = lengthY / 2;
        
        this.grid = [];
        for (let i = 0; i <= res; i++) {
            this.grid[i] = [];
            for (let j = 0; j <= res; j++)
                this.grid[i][j] = this.addVertex(new BABYLON.Vector3((j * stepX) - tX, 0, (i * stepY) - tY), BABYLON.Vector3.Up(), new BABYLON.Vector2((j * stepX) / lengthX, (i * stepY) / lengthY));
        }

        for (let y = 0; y < (this.grid.length - 1); y++)
            for (let x = 0; x < (this.grid[y].length - 1); x++) {
                const idx1 = x + y * this.grid[y].length;
                const idx2 = (x + 1) + y * this.grid[y].length;
                const idx3 = x + (y + 1) * this.grid[y].length;
                const idx4 = (x + 1) + (y + 1) * this.grid[y].length;

                const uv1 = new BABYLON.Vector2(x / (this.grid[y].length - 1), y / (this.grid.length - 1));
                const uv2 = new BABYLON.Vector2((x + 1) / (this.grid[y].length - 1), y / (this.grid.length - 1));
                const uv3 = new BABYLON.Vector2(x / (this.grid[y].length - 1), (y + 1) / (this.grid.length - 1));
                const uv4 = new BABYLON.Vector2((x + 1) / (this.grid[y].length - 1), (y + 1) / (this.grid.length - 1));

                this.addFace(idx1, idx2, idx3, BABYLON.Vector3.Up(), uv1, uv2, uv3);
                this.addFace(idx2, idx3, idx4, BABYLON.Vector3.Up(), uv2, uv3, uv4);
            }

        this.vertexNormalsComputed = true;
    }
}