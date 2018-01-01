import XHR from "./request"
import * as Engine from "../engine/Engine"

const canvasResults = document.getElementsByTagName("canvas");

const canvas = canvasResults[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const canvas2 = canvasResults[1];
canvas2.width = canvas2.clientWidth;
canvas2.height = canvas2.clientHeight;

const renderer = new Engine.Renderer(canvas);
const renderer2 = new Engine.Renderer(canvas2);

const camera = new Engine.Camera({ aspectRatio: renderer.canvas.width / renderer.canvas.height });
const camera2 = new Engine.Camera({ aspectRatio: renderer2.canvas.width / renderer2.canvas.height });

const scene = new Engine.Scene();

const materials = {
    plane: new Engine.PhongMaterial({
        diffuse: 1,
        specular: 0.1,
        shininess: 10
    }),
    car: new Engine.PhongMaterial({
        diffuse: 15,
        specular: 5,
        shininess: 10
    }),
    dragon: new Engine.PhongMaterial({
        diffuse: 50,
        specular: 1,
        shininess: 10
    }),
    teapot: new Engine.PhongMaterial({
        diffuse: 10,
        specular: 1,
        shininess: 10
    }),
    crank: new Engine.PhongMaterial({
        diffuse: 30,
        specular: 1,
        shininess: 30
    }),
    sphere: new Engine.PhongMaterial({
        diffuse: 20,
        specular: 1,
        shininess: 20
    })
};

const mesh = {
    plane: new Engine.Mesh(new Engine.PlaneGeometry(2000, 2000, 20), materials.plane),
    sphere: new Engine.Mesh(new Engine.TorusGeometry(2, 1, 50), materials.sphere)
} as { plane: Engine.Mesh, car: Engine.Mesh, dragon: Engine.Mesh, teapot: Engine.Mesh, crank: Engine.Mesh, sphere: Engine.Mesh };

XHR.async("models/test.obj").then(async file => {
    mesh.car = await Engine.Mesh.loadObjAsync(file, materials.car);
    mesh.car.translateX(100);
    mesh.car.scale(15);
    scene.addMesh(mesh.car);
});

XHR.async("models/dragon.obj").then(async file => {
    mesh.dragon = await Engine.Mesh.loadObjAsync(file, materials.dragon);
    mesh.dragon.scale(50);
    mesh.dragon.rotateX(-10 * Math.PI / 180);
    mesh.dragon.translateY(25);
    mesh.dragon.translateZ(-50);
    scene.addMesh(mesh.dragon);
});

XHR.async("models/teapot.obj").then(async file => {
    mesh.teapot = await Engine.Mesh.loadObjAsync(file, materials.teapot);
    mesh.teapot.scale(10);
    mesh.teapot.computeVertexNormals();
    mesh.teapot.translateZ(50);
    scene.addMesh(mesh.teapot);
});

XHR.async("models/crank.obj").then(async file => {
    mesh.crank = await Engine.Mesh.loadObjAsync(file, materials.crank);
    mesh.crank.scale(30);
    mesh.crank.translateX(-100);
    mesh.crank.translateY(50);
    scene.addMesh(mesh.crank);
});

if (mesh.plane == undefined)
    throw "LoadingError";
// mesh.plane.computeVertexNormals()
scene.addMesh(mesh.plane);

if (mesh.sphere == undefined)
    throw "LoadingError";
mesh.sphere.scale(20);
mesh.sphere.translateX(-100);
mesh.sphere.translateY(150);
scene.addMesh(mesh.sphere);

const light1 = scene.addPointLight(new BABYLON.Vector3(100, 20, 20), new BABYLON.Vector4(39 / 255, 174 / 255, 96 / 255, 1));
const light2 = scene.addPointLight(new BABYLON.Vector3(-60, 100, 20), new BABYLON.Vector4(231 / 255, 76 / 255, 60 / 255, 1));
const spotlight = scene.addSpotLight(new BABYLON.Vector3(400, 400, 400), new BABYLON.Vector3(400, 400, 400), 30, new BABYLON.Vector4(1, 1, 1, 1), 100);

spotlight.lookAt(BABYLON.Vector3.Zero());

const light1Helper = scene.addMesh(new Engine.PointLightHelper(light1));
const light2Helper = scene.addMesh(new Engine.PointLightHelper(light2));
const spotlightHelper = scene.addMesh(new Engine.PointLightHelper(spotlight));

camera.lookAt(BABYLON.Vector3.Zero());
camera2.lookAt(BABYLON.Vector3.Zero());

// scene.addAmbientLight(new BABYLON.Vector4(.1, .1, .1, 1));

let pos1 = 0, pos1Inc = 0.01;
let pos2 = 0, pos2Inc = 0.01;
let pos3 = 0, pos3Inc = -0.005;

setInterval(() => {
    light1.pos.x = Math.cos(pos1) * 50;
    light1.pos.y = Math.sin(pos1) * 50;
    light2.pos.x = Math.cos(pos2) * 50;
    light2.pos.z = Math.sin(pos2) * 50;
    spotlight.pos.x = Math.cos(pos3) * 400;
    spotlight.pos.z = Math.sin(pos3) * 400;
    spotlight.lookAt(BABYLON.Vector3.Zero());
    if (pos1 >= Math.PI)
        pos1Inc = -0.01;
    else if (pos1 <= 0)
        pos1Inc = 0.01;
    pos1 += pos1Inc;
    if (pos2 >= 2 * Math.PI)
        pos2 = 0;
    pos2 += pos2Inc;
    if (pos3 >= 2 * Math.PI)
        pos3 = 0;
    pos3 += pos3Inc;
    if (mesh.teapot) mesh.teapot.rotateY(0.01);
    if (mesh.crank) mesh.crank.rotate(0.01, 0.01, 0.01);
    mesh.sphere.rotate(0.01, 0.01, 0.01);
}, 10);

console.log(scene);

let drag = false;
const last = { x: 0, y: 0 };
let moveMode = 0;
let val = 0;
let rotate = false;

const controls = {
    distance: 200,
    mode: 0
};

document.addEventListener("contextmenu", ev => ev.preventDefault());
// document.addEventListener("mouseup", () => drag = false)
// document.addEventListener("mousemove", ev => {
//     if (!drag) return;
//     let v = { x: ev.pageX - last.x, y: ev.pageY - last.y }
//     if (moveMode == 0) {
//         scene.rotateY(Math.PI * 2 * v.x / canvas.width);
//         scene.rotateX(Math.PI * 2 * v.y / canvas.height);
//     } else if (moveMode == 2) {
//         scene.translateX(v.x * 0.05);
//         scene.translateY(-v.y * 0.05);
//     }
//     last.x = ev.pageX;
//     last.y = ev.pageY;
// })
document.addEventListener("wheel", ev => controls.distance -= (ev.deltaY > 0) ? -10 : 10);
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        renderer.setMode(renderer.getModeIdx() + 1);
    else if (ev.key == "e")
        rotate = !rotate;
});

function display() {
    camera.pos.x = Math.cos(val * 2) * controls.distance;
    camera.pos.z = Math.sin(val * 2) * controls.distance;
    camera.pos.y = controls.distance;
    camera2.pos.x = Math.cos(val + Math.PI) * controls.distance;
    camera2.pos.z = Math.sin(val + Math.PI) * controls.distance;
    camera2.pos.y = controls.distance;
    camera.matricesNeedUpdate = true;
    camera2.matricesNeedUpdate = true;

    renderer.render(scene, camera);
    renderer2.render(scene, camera2);

    if (rotate)
        val = (val + 0.02) % (Math.PI * 2);

    requestAnimationFrame(display);
}

const gui = new dat.GUI({
    autoPlace: true,
    name: "Scene control"
});

let folder = gui.addFolder("Scene");
folder.add(controls, "distance", 0, 750);
let modeControl = folder.add(controls, "mode", { "Standard": 0, "Wireframe": 1, "Points": 2 });
modeControl.onChange((val: number) => { renderer.setMode(controls.mode); controls.mode = renderer.getModeIdx() });

folder = gui.addFolder("Spotlight");
folder.add(spotlight, "intensity", 0, 700);
folder.add(spotlightHelper, "visible");
folder = folder.addFolder("Color");
folder.add(spotlight.color, "x", 0, 1);
folder.add(spotlight.color, "y", 0, 1);
folder.add(spotlight.color, "z", 0, 1);
folder.add(spotlight.color, "w", 0, 1);

display();