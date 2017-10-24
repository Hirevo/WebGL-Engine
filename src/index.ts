import Scene from "./engine/Scene"
import Mesh from "./engine/Mesh"
import XHR from "./request"
import PointLightHelper from "./engine/helpers/PointLightHelper";
import SphereGeometry from "./engine/geometries/SphereGeometry";
import { map } from "./engine/utils";
import PlaneGeometry from "./engine/geometries/PlaneGeometry";
import TorusGeometry from "./engine/geometries/TorusGeometry";
import SpotLightHelper from "./engine/helpers/SpotLightHelper";

let canvas = document.getElementById("draw") as HTMLCanvasElement;
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let gl = canvas.getContext("webgl") as WebGLRenderingContext;
if (gl == null)
    throw "WebGL not supported !"

export default gl

gl.clearDepth(1);
gl.depthFunc(gl.LEQUAL);
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0, 0, 0, 1);

let scene = new Scene()

let mesh = {
    plane: new Mesh(new PlaneGeometry()),
    car: Mesh.loadObj("models/test.obj"),
    dragon: Mesh.loadObj("models/dragon.obj"),
    teapot: Mesh.loadObj("models/teapot.obj"),
    crank: Mesh.loadObj("models/crank.obj"),
    sphere: new Mesh(new TorusGeometry(2, 1, 50))
}

if (mesh.plane == undefined)
    throw "LoadingError"
let vertexShader = XHR.sync("shaders/phongShading/vert.vs")
let fragmentShader = XHR.sync("shaders/phongShading/frag.fs")
if (vertexShader === undefined || fragmentShader === undefined)
    throw "LoadingError"
mesh.plane.addShaders(vertexShader, fragmentShader)
mesh.plane.setColor(1)
mesh.plane.computeVertexNormals()
mesh.plane.diffuse = 1;
mesh.plane.specular = 0.1;
mesh.plane.shininess = 10;
scene.addMesh(mesh.plane)

if (mesh.car == undefined)
    throw "LoadingError"
mesh.car.addShaders(vertexShader, fragmentShader)
mesh.car.setColor(1)
mesh.car.translateX(100)
mesh.car.scale(15)
mesh.car.diffuse = 15;
mesh.car.specular = 5;
mesh.car.shininess = 10;
scene.addMesh(mesh.car)

if (mesh.dragon == undefined)
    throw "LoadingError"
mesh.dragon.addShaders(vertexShader, fragmentShader)
mesh.dragon.setColor(1)
mesh.dragon.scale(50)
mesh.dragon.rotateX(-10 * Math.PI / 180)
mesh.dragon.translateY(25)
mesh.dragon.diffuse = 50;
mesh.dragon.specular = 1;
mesh.dragon.shininess = 10;
mesh.dragon.translateZ(-50)
scene.addMesh(mesh.dragon)

if (mesh.teapot == undefined)
    throw "LoadingError"
mesh.teapot.addShaders(vertexShader, fragmentShader)
mesh.teapot.setColor(1)
mesh.teapot.scale(10)
mesh.teapot.computeVertexNormals()
mesh.teapot.diffuse = 10;
mesh.teapot.specular = 1;
mesh.teapot.shininess = 10;
mesh.teapot.translateZ(50)
scene.addMesh(mesh.teapot)

if (mesh.crank == undefined)
    throw "LoadingError"
mesh.crank.addShaders(vertexShader, fragmentShader)
mesh.crank.setColor(1)
mesh.crank.scale(30)
mesh.crank.diffuse = 30;
mesh.crank.specular = 1;
mesh.crank.shininess = 30;
mesh.crank.translateX(-100)
mesh.crank.translateY(50)
scene.addMesh(mesh.crank)

if (mesh.sphere == undefined)
    throw "LoadingError"
mesh.sphere.addShaders(vertexShader, fragmentShader)
mesh.sphere.setColor(1)
mesh.sphere.scale(20)
mesh.sphere.diffuse = 20;
mesh.sphere.specular = 1;
mesh.sphere.shininess = 20;
mesh.sphere.translateX(-100)
mesh.sphere.translateY(150)
scene.addMesh(mesh.sphere)

let light1 = scene.addPointLight(new BABYLON.Vector3(100, 20, 20), new BABYLON.Vector4(39 / 255, 174 / 255, 96 / 255, 1))
let light2 = scene.addPointLight(new BABYLON.Vector3(-60, 100, 20), new BABYLON.Vector4(231 / 255, 76 / 255, 60 / 255, 1))
let spotlight = scene.addSpotLight(new BABYLON.Vector3(400, 400, 400), new BABYLON.Vector3(400, 400, 400), 30, new BABYLON.Vector4(1, 1, 1, 1), 100)

spotlight.lookAt(BABYLON.Vector3.Zero())

let light1Helper = scene.addMesh(new PointLightHelper(light1))
let light2Helper = scene.addMesh(new PointLightHelper(light2))
let spotlightHelper = scene.addMesh(new PointLightHelper(spotlight))

scene.lookAt(BABYLON.Vector3.Zero())

// scene.addAmbientLight(new BABYLON.Vector4(.1, .1, .1, 1))

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
    spotlight.lookAt(BABYLON.Vector3.Zero())
    if (pos1 >= Math.PI)
        pos1Inc = -0.01
    else if (pos1 <= 0)
        pos1Inc = 0.01
    pos1 += pos1Inc
    if (pos2 >= 2 * Math.PI)
        pos2 = 0
    pos2 += pos2Inc
    if (pos3 >= 2 * Math.PI)
        pos3 = 0
    pos3 += pos3Inc
    scene.getMesh(3).rotateY(0.01)
    scene.getMesh(4).rotate(0.01, 0.01, 0.01)
    mesh.sphere.rotate(0.01, 0.01, 0.01)
})

console.log(scene)

let drag = false
let last = { x: 0, y: 0 }
let moveMode = 0
let val = 0
let rotate = false

let controls = {
    modes: [gl.TRIANGLES, gl.LINES, gl.POINTS],
    mode: 0,
    distance: 200
}

document.addEventListener("contextmenu", ev => ev.preventDefault())
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
document.addEventListener("mousewheel", ev => controls.distance -= (ev.deltaY > 0) ? -10 : 10)
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        controls.mode = (controls.mode + 1) % 3;
    else if (ev.key == "e")
        rotate = !rotate
})

function display() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    scene.pos.x = Math.cos(val) * controls.distance
    scene.pos.z = Math.sin(val) * controls.distance
    scene.pos.y = controls.distance
    scene.updateView()
    scene.render(controls.modes[controls.mode])

    if (rotate)
        val = (val + 0.02) % (Math.PI * 2);

    requestAnimationFrame(display)
}

let gui = new dat.GUI({
    autoPlace: true,
    name: "Scene control"
})

let folder = gui.addFolder("Scene")
folder.add(controls, "distance", 0, 750)
folder.add(controls, "mode", { "Standard": 0, "Wireframe": 1, "Points": 2 })

folder = gui.addFolder("Spotlight")
folder.add(spotlight, "intensity", 0, 700)
folder.add(spotlightHelper, "visible")
folder = folder.addFolder("Color")
folder.add(spotlight.color, "x", 0, 1)
folder.add(spotlight.color, "y", 0, 1)
folder.add(spotlight.color, "z", 0, 1)
folder.add(spotlight.color, "w", 0, 1)

display()