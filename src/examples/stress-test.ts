import XHR from "./request"
import * as Engine from "../engine/Engine"
import { map, dist } from "../engine/Engine";

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = new Engine.Renderer(canvas);

const camera = new Engine.Camera({ aspectRatio: renderer.canvas.width / renderer.canvas.height, pos: new BABYLON.Vector3(0, 100, 100) });

const scene = new Engine.Scene();

const material = new Engine.PhongMaterial({
    color: BABYLON.Vector4.One(),
    diffuse: 1,
    specular: 1,
    shininess: 10
});

let angle = 0;

const nbCubes = 40;
const halfNbCubes = nbCubes / 2;
const cubeSize = 100 / (nbCubes * 2);
const cubes = [] as Engine.Mesh[][];

for (let i = -halfNbCubes; i < halfNbCubes; i++) {
    cubes.push([]);
    for (let j = -halfNbCubes; j < halfNbCubes; j++) {
        const cube = new Engine.Mesh(new Engine.BoxGeometry(cubeSize), material);
        console.log("GENERATED !")

        cube.pos.x = j * (cubeSize + 2);
        cube.pos.z = i * (cubeSize + 2);
        cubes[i + halfNbCubes].push(cube);
        scene.addMesh(cube);
    }
}

scene.addPointLight(new BABYLON.Vector3(0, 1000, 0), undefined, 1000);
scene.addPointLight(new BABYLON.Vector3(1000, 1000, 0), undefined, 1000);

console.log(scene);

let rotate = false;

const controls = {
    distance: 100,
    mode: 0
};

function setDistance(distance: number) {
    camera.pos = new BABYLON.Vector3(0, distance, distance);
    camera.lookAt(camera.target);
}

document.addEventListener("contextmenu", ev => ev.preventDefault());
document.addEventListener("wheel", ev => {
    controls.distance -= (ev.deltaY > 0) ? -10 : 10;
    setDistance(controls.distance);
});
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        renderer.setMode(renderer.getModeIdx() + 1);
    else if (ev.key == "e")
        rotate = !rotate
});

function display() {
    if (rotate)
        cubes.forEach(elem => elem.forEach(cube => cube.rotate(0.02, 0.02, 0.02)))

    renderer.render(scene, camera);

    requestAnimationFrame(display);
}

const gui = new dat.GUI({
    autoPlace: true,
    name: "40x40 cube grid (1600 total meshes)"
});

const folder = gui.addFolder("Scene");

const distanceControl = folder.add(controls, "distance", 0, 750);
distanceControl.onChange((val: number) => { setDistance(val); controls.distance = val; console.log(controls.distance) });

const modeControl = folder.add(controls, "mode", { "Standard": 0, "Wireframe": 1, "Points": 2 });
modeControl.onChange((val: number) => { renderer.setMode(controls.mode); controls.mode = renderer.getModeIdx() });

display();