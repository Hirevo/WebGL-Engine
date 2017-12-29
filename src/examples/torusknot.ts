import XHR from "./request"
import * as Engine from "../engine/Engine"

let renderer = new Engine.Renderer("draw");

let camera = new Engine.Camera({ aspectRatio: renderer.canvas.width / renderer.canvas.height });

let scene = new Engine.Scene();

const plane = new Engine.Mesh(new Engine.PlaneGeometry(2000, 2000, 20), new Engine.PhongMaterial({
    diffuse: 1,
    specular: 0.1,
    shininess: 10
}));

const material = new Engine.PhongMaterial({
    color: new BABYLON.Vector4(0.153, 0.882, 0.376, 1.0),
    diffuse: 1,
    specular: 1,
    shininess: 10
});

const torusKnots = [
    new Engine.Mesh(new Engine.TorusKnotGeometry(10, 5, 2, 3), material),
    new Engine.Mesh(new Engine.TorusKnotGeometry(10, 3, 3, 5), material)
]

const cube = new Engine.Mesh(new Engine.BoxGeometry(20, 5, 5), material);

if (plane == undefined)
    throw "LoadingError";
scene.addMesh(plane);

if (torusKnots.some(val => val == undefined))
    throw "LoadingError";
torusKnots[0].translateY(50);
torusKnots[1].translateY(50);
torusKnots[0].translateZ(-30);
torusKnots[1].translateZ(30);
scene.addMesh(torusKnots[0]);
scene.addMesh(torusKnots[1]);

cube.translateY(100);
scene.addMesh(cube);

let spotlight = scene.addSpotLight(new BABYLON.Vector3(400, 400, 400), new BABYLON.Vector3(400, 400, 400).normalize(), 30, new BABYLON.Vector4(1, 1, 1, 1), 200);

spotlight.lookAt(new BABYLON.Vector3(0, 50, 0));

let spotlightHelper = scene.addMesh(new Engine.PointLightHelper(spotlight));
spotlightHelper.visible = false;

camera.lookAt(new BABYLON.Vector3(0, 50, 0));

scene.addAmbientLight(new BABYLON.Vector4(.1, .1, .1, 1));

let pos = 0, posInc = -0.005;

console.log(scene);

let drag = false;
let last = { x: 0, y: 0 };
let moveMode = 0;
let val = 0;
let rotate = false;

let controls = {
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
document.addEventListener("mousewheel", ev => controls.distance -= (ev.deltaY > 0) ? -10 : 10);
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        renderer.setMode(renderer.getModeIdx() + 1);
    else if (ev.key == "e")
        rotate = !rotate
});

function display() {

    spotlight.pos.x = Math.cos(pos) * 400;
    spotlight.pos.z = Math.sin(pos) * 400;
    spotlight.lookAt(new BABYLON.Vector3(0, 50, 0));
    if (pos >= 2 * Math.PI)
        pos = 0;
    pos += posInc;
    torusKnots.forEach(knot => knot.rotate(0.02, 0.02, 0.02));
    cube.rotate(0.02, 0.02, 0.02);
    camera.pos.x = Math.cos(val * 2) * controls.distance;
    camera.pos.z = Math.sin(val * 2) * controls.distance;
    camera.pos.y = controls.distance;

    renderer.render(scene, camera);

    if (rotate)
        val = (val + 0.02) % (Math.PI * 2);

    requestAnimationFrame(display);
}

let gui = new dat.GUI({
    autoPlace: true,
    name: "Scene control"
});

let folder = gui.addFolder("Scene");
folder.add(controls, "distance", 0, 750);
let modeControl = folder.add(controls, "mode", { "Standard": 0, "Wireframe": 1, "Points": 2 });
modeControl.onChange = (val) => { renderer.setMode(controls.mode); controls.mode = renderer.getModeIdx() };

folder = gui.addFolder("Spotlight");
folder.add(spotlight, "intensity", 0, 700);
folder.add(spotlightHelper, "visible");
folder = folder.addFolder("Color");
folder.add(spotlight.color, "x", 0, 1);
folder.add(spotlight.color, "y", 0, 1);
folder.add(spotlight.color, "z", 0, 1);
folder.add(spotlight.color, "w", 0, 1);

display();