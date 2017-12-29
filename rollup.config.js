
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

let config = {
    input: process.env.INPUT,
    output: {
        file: process.env.OUTPUT,
        format: 'iife'
    },
    name: 'engine',
    globals: { babylonjs: 'BABYLON' },
    onwarn(warning) {
        // Suppress known error message caused by TypeScript compiled code with Rollup
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }
        console.log("Rollup warning: ", warning.message);
    },
    external: ['babylonjs'],
    plugins: []
};

if (process.env.NODE_ENV == 'production')
    config.plugins.push(uglify(undefined, minify))

export default config;

