
export * from "./Renderer"
export * from "./Scene"
export * from "./Camera"

export * from "./Geometry"
export * from "./Material"
export * from "./Mesh"

export * from "./materials/PhongMaterial"
export * from "./materials/BaseMaterial"

export * from "./geometries/PlaneGeometry"
export * from "./geometries/SphereGeometry"
export * from "./geometries/TorusGeometry"

export * from "./helpers/PointLightHelper"
export * from "./helpers/SpotLightHelper"

export * from "./utils"

export namespace Constants {
    export const phongMaterialVertexShader = `\
        precision mediump   float;
        precision mediump   int;

        attribute vec3      aPosition;
        attribute vec3      aNormal;

        uniform mat4        uMMatrix;
        uniform mat4        uVMatrix;
        uniform mat4        uPMatrix;

        uniform mat4        uNormalMatrix;

        varying vec4        normal;
        varying vec4        mPos;
        varying vec4        mvPos;

        void main() {
            mPos = uMMatrix * vec4(aPosition, 1.0);
            mvPos = uVMatrix * mPos;
            gl_Position = uPMatrix * mvPos;

            normal = vec4(aNormal, 1);
        }`
    export const phongMaterialFragmentShader = `
        precision mediump   float;
        precision mediump   int;

        struct      PointLight {
            vec3    pos;
            vec4    color;
            float   intensity;
        };

        struct      SpotLight {
            vec3    pos;
            vec3    dir;
            float   aper;
            vec4    color;
            float   intensity;
        };

        struct      AmbientLight {
            vec4    color;
        };

        uniform mat4            uVInvMatrix;
        uniform mat4            uNormalMatrix;

        uniform float           uNbPLights;
        uniform float           uNbSLights;

        uniform PointLight      uPLights[20];
        uniform SpotLight       uSLights[20];
        uniform AmbientLight    uALight;

        uniform vec4            color;
        uniform float           diffuse;
        uniform float           specular;
        uniform float           shininess;

        varying vec4            normal;
        varying vec4            mPos;
        varying vec4            mvPos;

        float       getSpecCoef(vec4 vertexToCamera, vec4 vertexToLight, vec4 finalNormal) {
            if (dot(vertexToLight, finalNormal) < 0.0)
                return 0.0;
            return pow(max(dot(reflect(-vertexToLight, finalNormal), vertexToCamera), 0.0), shininess) * specular;
        }

        float       getDiffuseCoef(vec4 vertexToLight, vec4 finalNormal) {
            return max(dot(vertexToLight, finalNormal), 0.0) * diffuse;
        }

        void        main() {
            vec4    finalNormal = uNormalMatrix * normal;
            vec4    camera = uVInvMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            vec4    vertexToCamera = normalize(camera - mPos);
            vec4    diffuseColors = vec4(0.0, 0.0, 0.0, 1.0), specColors = vec4(0.0, 0.0, 0.0, 1.0);
            float   attenuation = 0.0;

            if ((uNbPLights + uNbSLights) != 0.0) {
                for (int idx = 0; idx < 20; idx++) {
                    if (idx < int(uNbPLights)) {
                        vec4 vertexToLight = vec4(uPLights[idx].pos, 1) - mPos;
                        float attenuation = clamp(1.0 / length(vertexToLight) * uPLights[idx].intensity, 0.0, 1.0);

                        vertexToLight = normalize(vertexToLight);

                        diffuseColors += clamp(getDiffuseCoef(vertexToLight, finalNormal) * color * uPLights[idx].color, 0.0, 1.0) * attenuation;
                        specColors += clamp(getSpecCoef(vertexToCamera, vertexToLight, finalNormal) * color * uPLights[idx].color, 0.0, 1.0) * attenuation;
                    }
                    if (idx < int(uNbSLights)) {
                        vec4 vertexToLight = vec4(uSLights[idx].pos, 1) - mPos;
                        float attenuation = clamp(1.0 / length(vertexToLight) * uSLights[idx].intensity, 0.0, 1.0);

                        vertexToLight = normalize(vertexToLight);
                        float angle = degrees(acos(dot(-vertexToLight, vec4(normalize(uSLights[idx].dir), 1))));

                        if (angle <= uSLights[idx].aper) {
                            diffuseColors += clamp(getDiffuseCoef(vertexToLight, finalNormal) * color * uSLights[idx].color, 0.0, 1.0) * attenuation;
                            specColors += clamp(getSpecCoef(vertexToCamera, vertexToLight, finalNormal) * color * uSLights[idx].color, 0.0, 1.0) * attenuation;
                        }
                    }
                }

                diffuseColors = clamp(diffuseColors, 0.0, 1.0);
                specColors = clamp(specColors, 0.0, 1.0);
            }

            gl_FragColor = uALight.color + diffuseColors + specColors;
        }`

    export const baseMaterialVertexShader = `\
        precision mediump   float;
        precision mediump   int;

        attribute vec3      aPosition;
    
        uniform mat4        uMMatrix;
        uniform mat4        uVMatrix;
        uniform mat4        uPMatrix;
    
        void main() {
            gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1);
        }`

    export const baseMaterialFragmentShader = `\
        precision mediump   float;
        precision mediump   int;

        uniform vec4        color;

        void main() {
            gl_FragColor = color;
        }`
}