
precision mediump   float;
precision mediump   int;

uniform highp mat4  uNormalMatrix;

varying vec4        normal;

void                main() {
    vec4 finalNormal = uNormalMatrix * normal;
    gl_FragColor = vec4(finalNormal.xyz, 1);
}
