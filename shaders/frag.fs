
uniform highp mat4    uVInvMatrix;

struct          PointLight {
    highp vec4  pos;
    highp vec4  color;
};

struct          AmbientLight {
    highp vec4  color;
};

uniform lowp float    uNbPLights;

uniform PointLight    uPLights[20];
uniform PointLight    uALight;

uniform highp vec4    color;
uniform highp float   diffuse;
uniform highp float   specular;
uniform highp float   shininess;

varying highp vec4    lighting;
varying highp vec4    normal;
varying highp vec4    mPos;
varying highp vec4    mvPos;

highp float getSpecCoef(highp vec4 vertexToCamera, highp vec4 vertexToLight) {
    if (dot(vertexToLight, normal) < 0.0)
        return 0.0;
    return pow(max(dot(reflect(-vertexToLight, normal), vertexToCamera), 0.0), shininess) * specular;
}

highp float getDiffuseCoef(highp vec4 vertexToLight) {
    return max(dot(vertexToLight, normal), 0.0) * diffuse;
}

void                main() {
    highp vec4      camera = uVInvMatrix * vec4(0, 0, 0, 1);
    highp vec4      vertexToCamera = normalize(camera - mPos);
    highp vec4      diffuseColors = vec4(0, 0, 0, 1), specColors = vec4(0, 0, 0, 1);

    if (uNbPLights != 0.0) {
        for (int idx = 0; idx < 20; idx++) {
            if (idx >= int(uNbPLights))
                break;
            highp vec4 vertexToLight = normalize(uPLights[idx].pos - mPos);

            diffuseColors += clamp(getDiffuseCoef(vertexToLight) * color * uPLights[idx].color, 0.0, 1.0);
            specColors += clamp(getSpecCoef(vertexToCamera, vertexToLight) * color * uPLights[idx].color, 0.0, 1.0);
        }

        diffuseColors /= uNbPLights;
        specColors /= uNbPLights;
    }

    gl_FragColor = uALight.color + diffuseColors + specColors;
}