import XHR from "./request"
import * as Engine from "../engine/Engine"
import { PhongMaterial, Material, BoxGeometry, PlaneGeometry } from "../engine/Engine";

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = new Engine.Renderer(canvas);

const camera = new Engine.Camera({ aspectRatio: canvas.width / canvas.height, pos: new BABYLON.Vector3(0, 0, -550) });

const scene = new Engine.Scene();

const image = document.createElement("img");
image.src = "resources/wall1.bmp";
image.addEventListener("load", _ => {
    const texture = new Engine.Texture(image);
    const cube = new Engine.Mesh(new Engine.BoxGeometry(100), new PhongMaterial({
        texture: texture,
        diffuse: 1,
        specular: 1,
        shininess: 1
    }));
    cube.translateX(175);
    scene.addMesh(cube);
    setInterval(() => cube.rotate(0.01, 0.01, 0.01), 10);
});

const image2 = document.createElement("img");
image2.src = "resources/wall2.bmp";
image2.addEventListener("load", _ => {
    const texture = new Engine.Texture(image2);
    const cube = new Engine.Mesh(new Engine.BoxGeometry(100), new PhongMaterial({
        texture: texture,
        diffuse: 1,
        specular: 1,
        shininess: 1
    }));
    cube.translateX(-175);
    scene.addMesh(cube);
    setInterval(() => cube.rotate(0.01, 0.01, 0.01), 10);
});

camera.lookAt(BABYLON.Vector3.Zero());

const plane = scene.addMesh(new Engine.Mesh(new Engine.PlaneGeometry(2000, 2000, 1), new Engine.PhongMaterial({ specular: 0 })));
plane.rotateX(-Math.PI / 2);
plane.translateZ(200);
scene.addAmbientLight(new BABYLON.Vector4(0.1, 0.1, 0.1, 1));
const pointLight = scene.addPointLight(new BABYLON.Vector3(0, 100, -200), BABYLON.Vector4.One(), 300);
const pointLightHelper = scene.addMesh(new Engine.PointLightHelper(pointLight));

let drag = false;
const last = { x: 0, y: 0 };
let moveMode = 0;

const controls = {
    mode: 0
};

console.log(scene);

document.addEventListener("wheel", ev => camera.pos.z += (ev.deltaY > 0) ? -10 : 10);
document.addEventListener("contextmenu", ev => ev.preventDefault());
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        renderer.setMode(renderer.getModeIdx() + 1);
});

function display() {
    renderer.render(scene, camera);
    requestAnimationFrame(display);
}

const gui = new dat.GUI({
    autoPlace: true,
    name: "Scene control"
});

let folder = gui.addFolder("Scene");
folder.add(camera.pos, "z");
let modeControl = folder.add(controls, "mode", { "Standard": 0, "Wireframe": 1, "Points": 2 });
modeControl.onChange((val: number) => { renderer.setMode(controls.mode); controls.mode = renderer.getModeIdx() });

display();