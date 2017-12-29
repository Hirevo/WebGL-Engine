# WebGL-Engine

## A custom little WebGL 3D engine

This is a WebGL engine I am working on to "test" my capabilities with 3D computer graphics.  
It's done for fun and to get a better understanding of the modern 3D rendering techniques by implementing them and tinkering with them.  

Try out the demo scene [HERE](https://hirevo.github.io/WebGL-Engine) !

You can clone the project and build it locally like this:  
```
npm run build-prod
```

## Features

### Lighting

- Diffuse lighting
- Specular lighting
- Multiple point lights (Up to 20)
- Multiple spot lights (Up to 20)
- Ambient light
- Intensity attenuation

### Meshes

- Multiple meshes
- OBJ model parsing
- Mesh transformations
- Wireframe
- Shader loading

### Geometries

- Primitive geometries: Plane, Box, Sphere, Torus, Torus-Knot
- Custom arbitrary geometries
- Vertex normals computing
- Per-Renderer caching and updates

### Materials

- Primitive materials: Basic, Phong, Normal
- Custom arbitrary materials
- Per-Renderer caching and updates

### Helpers

- PointLight Helper

### Renderer

- WebGL Renderer

### Scene

- Renderer-agnostic

### Camera

- Camera transformations
- Dynamic look-at tracking
- Automatic updates on property changes

## Things I want to do and have yet to do

- Shadow mapping
- Scene raycaster
- More primitive geometries (Cylinder, Cone, etc...)
- Mores helpers (Light helpers, camera helpers, geometry helpers, etc...)
- 3D Anaglyph
- Physics engine
