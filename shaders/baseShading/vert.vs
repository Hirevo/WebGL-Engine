precision mediump   float;
precision mediump   int;

attribute vec3      aPosition;
    
uniform mat4        uMMatrix;
uniform mat4        uVMatrix;
uniform mat4        uPMatrix;
    
void main() {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1);
}