
precision mediump   float;
precision mediump   int;

attribute vec3      aPosition;
attribute vec3      aNormal;
attribute vec2      aTexCoord;

uniform mat4        uMMatrix;
uniform mat4        uVMatrix;
uniform mat4        uPMatrix;

uniform mat4        uNormalMatrix;

varying vec4        normal;
varying vec4        mPos;
varying vec4        mvPos;
varying vec2        texCoord;

void main() {
    mPos = uMMatrix * vec4(aPosition, 1.0);
    mvPos = uVMatrix * mPos;
    gl_Position = uPMatrix * mvPos;

    normal = vec4(aNormal, 1);
    texCoord = aTexCoord;
}