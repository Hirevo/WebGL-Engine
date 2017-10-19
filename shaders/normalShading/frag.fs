
varying highp vec4  normal;

void                main() {
    gl_FragColor = vec4(normal.xyz, 1);
}
