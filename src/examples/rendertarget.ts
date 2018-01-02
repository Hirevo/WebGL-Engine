import XHR from "./request"
import * as Engine from "../engine/Engine"
import { PhongMaterial, Material } from "../engine/Engine";

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = new Engine.Renderer(canvas);

const camera = new Engine.Camera({ aspectRatio: 1, pos: new BABYLON.Vector3(0, 200, -100) });
const camera2 = new Engine.Camera({ aspectRatio: renderer.canvas.width / renderer.canvas.height, pos: new BABYLON.Vector3(0, 0, -500) });

const renderTarget = new Engine.RenderTexture(2000, 2000);

const scene = new Engine.Scene();
const scene2 = new Engine.Scene();

const cube = new Engine.Mesh(new Engine.BoxGeometry(100), new PhongMaterial({
    texture: renderTarget,
    diffuse: 10,
    specular: 1,
    shininess: 1
}));

scene2.addMesh(cube);
setInterval(() => cube.rotate(0.01, 0.01, 0.01), 10);

scene2.addAmbientLight(BABYLON.Vector4.One());

const materials = {
    plane: new Engine.PhongMaterial({
        diffuse: 1,
        specular: 0.1,
        shininess: 10
    }),
    teapot: new Engine.PhongMaterial({
        diffuse: 10,
        specular: 1,
        shininess: 10
    })
};

const mesh = {
    plane: new Engine.Mesh(new Engine.PlaneGeometry(2000, 2000, 20), materials.plane)
} as { plane: Engine.Mesh, teapot: Engine.Mesh };

XHR.async("resources/models/teapot.obj").then(async file => {
    mesh.teapot = await Engine.Mesh.loadObjAsync(file, materials.teapot);
    mesh.teapot.scale(10);
    mesh.teapot.computeVertexNormals();
    mesh.teapot.translateZ(50);
    scene.addMesh(mesh.teapot);
});

if (mesh.plane == undefined)
    throw "LoadingError";
// mesh.plane.computeVertexNormals()
scene.addMesh(mesh.plane);

const light1 = scene.addPointLight(new BABYLON.Vector3(100, 20, 20), new BABYLON.Vector4(39 / 255, 174 / 255, 96 / 255, 1));
const light2 = scene.addPointLight(new BABYLON.Vector3(-60, 100, 20), new BABYLON.Vector4(231 / 255, 76 / 255, 60 / 255, 1));

const light1Helper = scene.addMesh(new Engine.PointLightHelper(light1));
const light2Helper = scene.addMesh(new Engine.PointLightHelper(light2));

camera.lookAt(BABYLON.Vector3.Zero());
camera2.lookAt(BABYLON.Vector3.Zero());

scene.addAmbientLight(new BABYLON.Vector4(.1, .1, .1, 1));

let pos1 = 0, pos1Inc = 0.01;
let pos2 = 0, pos2Inc = 0.01;

setInterval(() => {
    light1.pos.x = Math.cos(pos1) * 50;
    light1.pos.y = Math.sin(pos1) * 50;
    light2.pos.x = Math.cos(pos2) * 50;
    light2.pos.z = Math.sin(pos2) * 50;
    if (pos1 >= Math.PI)
        pos1Inc = -0.01;
    else if (pos1 <= 0)
        pos1Inc = 0.01;
    pos1 += pos1Inc;
    if (pos2 >= 2 * Math.PI)
        pos2 = 0;
    pos2 += pos2Inc;
    if (mesh.teapot) mesh.teapot.rotateY(0.01);
}, 10);

// console.log(scene);

let drag = false;
const last = { x: 0, y: 0 };
let moveMode = 0;

const controls = {
    mode: 0
};

document.addEventListener("wheel", ev => camera2.pos.z += (ev.deltaY > 0) ? -10 : 10);
document.addEventListener("contextmenu", ev => ev.preventDefault());
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        renderer.setMode(renderer.getModeIdx() + 1);
});

function display() {
    renderer.render(scene, camera, renderTarget);
    renderer.render(scene2, camera2);
    requestAnimationFrame(display);
}

const gui = new dat.GUI({
    autoPlace: true,
    name: "Scene control"
});

let folder = gui.addFolder("Scene");
let modeControl = folder.add(controls, "mode", { "Standard": 0, "Wireframe": 1, "Points": 2 });
modeControl.onChange((val: number) => { renderer.setMode(controls.mode); controls.mode = renderer.getModeIdx() });

display();