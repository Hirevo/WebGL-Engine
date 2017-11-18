import { Geometry } from "../Geometry";
import { Vertex } from "../utils";

export class PlaneGeometry extends Geometry {

    grid: Vertex[][];

    constructor(lengthX: number, lengthY = lengthX, res = 2) {
        super();

        let stepX = lengthX / res;
        let stepY = lengthY / res;
        let tX = lengthX / 2;
        let tY = lengthY / 2;
        
        this.grid = [];
        for (let i = 0; i <= res; i++) {
            this.grid[i] = [];
            for (let j = 0; j <= res; j++)
                this.grid[i][j] = this.addVertex(new BABYLON.Vector3((j * stepX) - tX, 0, (i * stepY) - tY), BABYLON.Vector3.Up(), new BABYLON.Vector2((j * stepX) / lengthX, (i * stepY) / lengthY));
        }

        for (let y = 0; y < (this.grid.length - 1); y++)
            for (let x = 0; x < (this.grid[y].length - 1); x++) {
                let idx1 = x + y * this.grid[y].length;
                let idx2 = (x + 1) + y * this.grid[y].length;
                let idx3 = x + (y + 1) * this.grid[y].length;
                let idx4 = (x + 1) + (y + 1) * this.grid[y].length;

                this.addFace(idx1, idx2, idx3);
                this.addFace(idx2, idx3, idx4);
            }

        this.vertexNormalsComputed = true;
    }
}