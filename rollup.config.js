
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es'

let config = {
    input: 'dist/index.js',
    output: {
        file: 'dist/build.js',
        format: 'iife'
    },
    name: 'engine',
    globals: { babylonjs: 'BABYLON' },
    external: [ 'babylonjs' ],
    plugins: []
};

if (process.env.NODE_ENV == 'production')
    config.plugins.push(uglify(undefined, minify))

export default config;