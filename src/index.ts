import * as BABYLON from "babylonjs"
import Scene from "./scene"
import Mesh from "./mesh"
import XHR from "./request"

let canvas = document.getElementById("draw") as HTMLCanvasElement;
canvas.width = window.innerWidth
canvas.height = window.innerHeight

export let gl = canvas.getContext("webgl") as WebGLRenderingContext;
if (gl == null)
    throw "WebGL not supported !"

export default gl

gl.clearDepth(1);
gl.depthFunc(gl.LEQUAL);
gl.enable(gl.DEPTH_TEST);
// gl.frontFace(gl.CCW);
// gl.enable(gl.CULL_FACE);
// gl.cullFace(gl.BACK);
gl.clearColor(0, 0, 0, 1);

let scene = new Scene()

let mesh = Mesh.loadObj("/plane.obj")
if (mesh == undefined)
    throw "LoadingError"
let vertexShader = XHR.sync("/shaders/vert.vs")
let fragmentShader = XHR.sync("/shaders/frag.fs")
if (vertexShader === undefined || fragmentShader === undefined)
    throw "LoadingError"
mesh.addShaders(vertexShader, fragmentShader)
mesh.setColor(1)
mesh.computeVertexNormals()
mesh.diffuse = 10;
mesh.specular = 30;
mesh.shininess = 10;
scene.addMesh(mesh)

mesh = Mesh.loadObj("/dragon.obj")
if (mesh == undefined)
throw "LoadingError"
mesh.addShaders(vertexShader, fragmentShader)
mesh.setColor(1)
mesh.scale(50)
mesh.rotateX(-10 * Math.PI / 180)
mesh.translateY(25)
mesh.diffuse = 50;
mesh.specular = 1;
mesh.shininess = 10;
mesh.translateZ(-50)
scene.addMesh(mesh)

mesh = Mesh.loadObj("/teapot.obj")
if (mesh == undefined)
    throw "LoadingError"
mesh.addShaders(vertexShader, fragmentShader)
mesh.setColor(1)
mesh.scale(10)
mesh.computeVertexNormals()
mesh.diffuse = 50;
mesh.specular = 1;
mesh.shininess = 10;
mesh.translateZ(50)
scene.addMesh(mesh)

scene.translateZ(-200)
scene.addPointLight(new BABYLON.Vector3(100, 20, 20), new BABYLON.Vector4(1, 0, 0, 1))
scene.addPointLight(new BABYLON.Vector3(-100, 20, 20), new BABYLON.Vector4(0, 1, 0, 1))
scene.addAmbientLight(new BABYLON.Vector4(0.1, 0.1, 0.1, 1.0))
mesh.computeVertexNormals()
mesh.diffuse = 10;
mesh.specular = 1;
mesh.shininess = 10;

console.log(scene)

let drag = false
let last = { x: 0, y: 0 }
let modes = [gl.TRIANGLES, gl.LINES, gl.POINTS]
let mode = 0
let moveMode = 0

document.addEventListener("mousedown", ev => {
    drag = true
    last.x = ev.pageX
    last.y = ev.pageY
    moveMode = ev.button
    ev.preventDefault()
})
document.addEventListener("contextmenu", ev => ev.preventDefault())
document.addEventListener("mouseup", () => drag = false)
document.addEventListener("mousemove", ev => {
    if (!drag) return;
    let v = { x: ev.pageX - last.x, y: ev.pageY - last.y }
    if (moveMode == 0) {
        scene.rotateY(Math.PI * 2 * v.x / canvas.width);
        scene.rotateX(Math.PI * 2 * v.y / canvas.height);
    } else if (moveMode == 2) {
        scene.translateX(v.x * 0.05);
        scene.translateY(-v.y * 0.05);
    }
    last.x = ev.pageX;
    last.y = ev.pageY;
})
document.addEventListener("mousewheel", ev => scene.translate(0, 0, (ev.deltaY > 0) ? -1 : 1))
document.addEventListener("keypress", ev => {
    if (ev.key == "w")
        mode = (mode + 1) % 3;
})

function display() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    scene.render(modes[mode])

    requestAnimationFrame(display)
}

display()