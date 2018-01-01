import XHR from "./request"
import * as Engine from "../engine/Engine"

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = new Engine.Renderer(canvas);

const camera = new Engine.Camera({ aspectRatio: renderer.canvas.width / renderer.canvas.height, far: 50000 });

const scene = new Engine.Scene();

const materials = {
    plane: new Engine.PhongMaterial({
        diffuse: 1,
        specular: 0.1,
        shininess: 10
    })
};

const mesh = {
    plane: new Engine.Mesh(new Engine.PlaneGeometry(2000, 2000, 50), materials.plane),
};

if (mesh.plane == undefined)
    throw "LoadingError"
scene.addMesh(mesh.plane);

camera.lookAt(BABYLON.Vector3.Zero());

scene.addPointLight(new BABYLON.Vector3(0, 1000, 0), undefined, 1000);

// scene.addAmbientLight(new BABYLON.Vector4(.5, .5, .5, 1));

noise.seed(Math.random());

let xProg = 0;
let zProg = 0;
const controls = {
    distance: 900,
    mode: 0,
    amplitude: 470,
    frequency: 22
}

const n = setInterval(() => {
    xProg += 0.00;
    zProg += 0.01;

    (mesh.plane.geometry as Engine.PlaneGeometry).grid.forEach((arr, x) => arr.forEach((elem, z) =>
        elem.pos.y = Math.round(noise.simplex2(x / controls.frequency + xProg, z / controls.frequency + zProg) * controls.amplitude)));

    mesh.plane.requestGeometryUpdate(true);
}, 10)

console.log(scene);

const last = { x: 0, y: 0 };
let moveMode = 0;
let val = 0;
let rotate = false;

document.addEventListener("contextmenu", ev => ev.preventDefault());
document.addEventListener("wheel", ev => {
    controls.distance -= (ev.deltaY > 0) ? -10 : 10;
    camera.pos.x = Math.cos(val) * controls.distance;
    camera.pos.z = Math.sin(val) * controls.distance;
    camera.pos.y = controls.distance;
    camera.matricesNeedUpdate = true;
});
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        renderer.setMode(renderer.getModeIdx() + 1);
    else if (ev.key == "e")
        rotate = !rotate;
});

camera.pos.x = Math.cos(val) * controls.distance;
camera.pos.z = Math.sin(val) * controls.distance;
camera.pos.y = controls.distance;
camera.matricesNeedUpdate = true;

function display() {
    if (rotate) {
        val = (val + 0.02) % (Math.PI * 2);
        camera.pos.x = Math.cos(val) * controls.distance;
        camera.pos.z = Math.sin(val) * controls.distance;
        camera.pos.y = controls.distance;
        camera.matricesNeedUpdate = true;    
    }

    renderer.render(scene, camera);

    requestAnimationFrame(display);
}

const gui = new dat.GUI({
    autoPlace: true,
    name: "Scene control"
});

let folder = gui.addFolder("Scene");
folder.add(controls, "distance", 0, 4000).listen().onChange(() => {
    camera.pos.x = Math.cos(val) * controls.distance;
    camera.pos.z = Math.sin(val) * controls.distance;
    camera.pos.y = controls.distance;
    camera.matricesNeedUpdate = true;
});

let modeControl: dat.GUIController;
modeControl = folder.add(controls, "mode", { "Standard": 0, "Wireframe": 1, "Points": 2 }).listen();
modeControl.onChange((val: number) => { renderer.setMode(controls.mode); controls.mode = renderer.getModeIdx() });

folder.add(controls, "amplitude").listen();
folder.add(controls, "frequency").listen();

display();