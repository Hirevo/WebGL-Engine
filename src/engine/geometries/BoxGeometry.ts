import { Geometry } from "../Geometry";

export class BoxGeometry extends Geometry {

    constructor(widthOrSize?: number, height?: number, depth?: number) {
        super();

        const given = {
            width: typeof widthOrSize !== "undefined",
            height: typeof height !== "undefined",
            depth: typeof depth !== "undefined"
        };

        const final = {
            width: 10,
            height: 10,
            depth: 10
        };

        if (given.width) {
            final.width = widthOrSize as number;
            if (!given.depth && !given.height) {
                final.height = widthOrSize as number;
                final.depth = widthOrSize as number;
            }
        }
        if (given.height)
           final.height = height as number;
        if (given.depth)
            final.depth = depth as number;

        this.addVertex(new BABYLON.Vector3(final.width, final.height, final.depth));
        this.addVertex(new BABYLON.Vector3(-final.width, final.height, final.depth));
        this.addVertex(new BABYLON.Vector3(final.width, -final.height, final.depth));
        this.addVertex(new BABYLON.Vector3(-final.width, -final.height, final.depth));
        this.addVertex(new BABYLON.Vector3(final.width, final.height, -final.depth));
        this.addVertex(new BABYLON.Vector3(-final.width, final.height, -final.depth));
        this.addVertex(new BABYLON.Vector3(final.width, -final.height, -final.depth));
        this.addVertex(new BABYLON.Vector3(-final.width, -final.height, -final.depth));

        this.addFace(0, 1, 2, BABYLON.Vector3.Forward());
        this.addFace(3, 1, 2, BABYLON.Vector3.Forward());
        this.addFace(4, 5, 6, new BABYLON.Vector3(0, 0, -1));
        this.addFace(7, 5, 6, new BABYLON.Vector3(0, 0, -1));
        this.addFace(0, 1, 4, BABYLON.Vector3.Up());
        this.addFace(5, 1, 4, BABYLON.Vector3.Up());
        this.addFace(2, 3, 6, new BABYLON.Vector3(0, -1, 0));
        this.addFace(7, 3, 6, new BABYLON.Vector3(0, -1, 0));
        this.addFace(0, 2, 4, BABYLON.Vector3.Right());
        this.addFace(6, 2, 4, BABYLON.Vector3.Right());
        this.addFace(1, 3, 5, BABYLON.Vector3.Left());
        this.addFace(7, 3, 5, BABYLON.Vector3.Left());
    }

}