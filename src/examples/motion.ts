import XHR from "./request"
import * as Engine from "../engine/Engine"

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = new Engine.Renderer(canvas);

const camera = new Engine.Camera({ aspectRatio: renderer.canvas.width / renderer.canvas.height });

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
    camera.lookAt(mesh.car.pos);
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

scene.addMesh(mesh.plane);

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
const bias = new BABYLON.Vector3(0, Math.PI / 2, 0);
let move = 0;

const controls = {
    distance: 200,
    mode: 0
};

document.addEventListener("contextmenu", ev => ev.preventDefault());
document.addEventListener("wheel", ev => controls.distance -= (ev.deltaY > 0) ? -10 : 10);
document.addEventListener("keydown", ev => {
    if (ev.key == "z")
        move = move | (1 << 0);
    else if (ev.key == "s")
        move = move | (1 << 1);
    else if (ev.key == "d")
        move = move | (1 << 2);
    else if (ev.key == "q")
        move = move | (1 << 3);
});
document.addEventListener("keyup", ev => {
    if (ev.key == "z")
        move = move & ~(1 << 0);
    else if (ev.key == "s")
        move = move & ~(1 << 1);
    else if (ev.key == "d")
        move = move & ~(1 << 2);
    else if (ev.key == "q")
        move = move & ~(1 << 3);
});
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        renderer.setMode(renderer.getModeIdx() + 1);
    else if (ev.key == "e")
        rotate = !rotate;
});

function display() {
    camera.pos.x = Math.cos(val) * controls.distance;
    camera.pos.z = Math.sin(val) * controls.distance;
    camera.pos.y = controls.distance;
    camera.matricesNeedUpdate = true;
    
    if (move & (1 << 0))
    if (mesh.car) mesh.car.forward(-5, bias);
    if (move & (1 << 1))
    if (mesh.car) mesh.car.forward(5, bias);
    if (move & (1 << 2))
    if (mesh.car) mesh.car.rotateY(-0.1);
    if (move & (1 << 3))
    if (mesh.car) mesh.car.rotateY(0.1);
    
    renderer.render(scene, camera);
    
    if (rotate)
    val = (val + 0.02) % (Math.PI * 2);

    requestAnimationFrame(display);
}

let gui = new dat.GUI({
    autoPlace: true,
    name: "Scene control"
})

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