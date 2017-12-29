
attribute highp vec3    aPosition;
attribute highp vec3    aNormal;

uniform highp mat4      uMMatrix;
uniform highp mat4      uVMatrix;
uniform highp mat4      uPMatrix;

varying highp vec4      normal;
varying highp vec4      mPos;
varying highp vec4      mvPos;

void main() {
    mPos = uMMatrix * vec4(aPosition, 1.0);
    mvPos = uVMatrix * mPos;
    gl_Position = uPMatrix * mvPos;

    normal = vec4(aNormal, 1);
}