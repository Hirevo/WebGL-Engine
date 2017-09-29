# WebGL-Engine

## A custom little WebGL 3D engine

This is a WebGL engine I am working on to "test" my capabilities with 3D computer graphics.  
It's done for fun and to get a better understanding of the modern 3D rendering techniques by implementing them and tinkering with them.  

Try out the demo scene [HERE](https://hirevo.github.io/WebGL-Engine) !

You can clone the project and build it locally like this:  
```
npm run build
```


## Features

### Lighting

- Diffuse lighting
- Specular lighting
- Ambient lighting
- Multiple point lights (Up to 20)
- Ambient light

### Meshes

- Multiple meshes
- OBJ model parsing
- Mesh transformations
- Wireframe
- Vertex normals computing
- Shader loading

### Scene and camera

- Camera transformations
- Dynamic look-at tracking (Partial support, WIP)

## Things I want to do and have yet to do

- Spotlights
- Scene raycaster
- Abritrary geometries
- Primitive geometries (Sphere, Box, Cylinder, Cone, Torus, Torus-Knot)
- Helpers (Light helpers, camera helpers, etc...)
- 3D Anaglyph
- Physics engine
