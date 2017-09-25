
attribute highp vec3    aPosition;
attribute highp vec3    aNormal;

uniform highp mat4      uMMatrix;
uniform highp mat4      uVMatrix;
uniform highp mat4      uPMatrix;

uniform highp mat4      uNormalMatrix;

varying highp vec4      lighting;
varying highp vec4      normal;
varying highp vec4      mPos;
varying highp vec4      mvPos;

float linmap(float val, float A, float B, float a, float b) {
    return (val - A)*(b-a)/(B-A) + a;
}

void main() {

    mPos = uMMatrix * vec4(aPosition, 1.0);
    mvPos = uVMatrix * mPos;
    gl_Position = uPMatrix * mvPos;

    normal = vec4(aNormal, 1);
}