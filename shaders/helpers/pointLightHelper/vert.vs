
attribute highp vec3    aPosition;

uniform highp mat4      uMMatrix;
uniform highp mat4      uVMatrix;
uniform highp mat4      uPMatrix;

void main() {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1);
}