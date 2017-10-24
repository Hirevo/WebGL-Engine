import Geometry from "../Geometry";

export default class SphereGeometry extends Geometry {
    constructor(resolution: number) {
        super()
        let div = (2 * Math.PI) / resolution
        let grid: BABYLON.Vector3[][] = []
        let pi = Math.PI
        let half_pi = pi / 2
        for (let lon = -pi, i = 0; lon <= (pi + div); lon += div, i++) {
            let tmp: BABYLON.Vector3[] = []
            grid.push(tmp)
            for (let lat = -half_pi, j = 0; lat <= (half_pi + div); lat += div, j++) {
                let x = 2 * Math.sin(lon) * Math.cos(lat)
                let y = 2 * Math.sin(lon) * Math.sin(lat)
                let z = 2 * Math.cos(lon)
                tmp.push(new BABYLON.Vector3(x, y, z));
            }
        }

        let vertexCount = 0
        for (let x = 0; x < grid.length; x++)
            for (let y = 0; y < grid[x].length; y++)
                this.addVertex(grid[x][y], grid[x][y].clone().normalize())

        div = Math.floor(Math.PI * 2 / div)
        for (let x = 0; x < (grid.length - 1); x++)
            for (let y = 0; y < (grid[x].length - 1); y++) {
                let idx1 = y + x * grid[x].length
                let idx2 = (y + 1) + x * grid[x].length
                let idx3 = y + (x + 1) * grid[x].length
                let idx4 = (y + 1) + (x + 1) * grid[x].length
                this.addFace(idx1, idx2, idx3)
                this.addFace(idx2, idx3, idx4)
            }

        this.vertexNormalsComputed = true
    }
}