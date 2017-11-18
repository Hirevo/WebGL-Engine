import { Geometry } from "../Geometry"

export class TorusKnotGeometry extends Geometry {
    constructor(largeRadius: number, smallRadius: number, resolution: number) {
        super()

        let div = (2 * Math.PI) / resolution
        let grid: { lon: number, lat: number, pos: BABYLON.Vector3 }[][] = []
        let pi = Math.PI
        let half_pi = pi / 2
        for (let lon = -pi; lon <= (pi + div); lon += div) {
            let tmp: { lon: number, lat: number, pos: BABYLON.Vector3 }[] = []
            grid.push(tmp)
            for (let lat = -pi; lat <= (pi + div); lat += div) {
                let x = (largeRadius + smallRadius * Math.cos(lon)) * Math.cos(lat)
                let y = (largeRadius + smallRadius * Math.cos(lon)) * Math.sin(lat)
                let z = smallRadius * Math.sin(lon)
                tmp.push({ lon, lat, pos: new BABYLON.Vector3(x, y, z) })
            }
        }

        let vertexCount = 0
        for (let x = 0; x < grid.length; x++)
            for (let y = 0; y < grid[x].length; y++)
                this.addVertex(grid[x][y].pos, grid[x][y].pos.subtractFromFloats(largeRadius * Math.cos(grid[x][y].lat), largeRadius * Math.sin(grid[x][y].lat), 0))

        for (let y = 0; y < (grid.length - 1); y++)
            for (let x = 0; x < (grid[y].length - 1); x++) {
                let idx1 = x + (y + 1) * grid[y].length
                let idx2 = x + y * grid[y].length
                let idx3 = (x + 1) + y * grid[y].length
                let idx4 = (x + 1) + (y + 1) * grid[y].length
                this.addFace(idx1, idx2, idx4)
                this.addFace(idx2, idx3, idx4)
            }

        this.vertexNormalsComputed = true;
    }
}