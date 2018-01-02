
import uglify from 'rollup-plugin-uglify';
import string from 'rollup-plugin-string';
import typescript from 'rollup-plugin-typescript';
import tsc from 'typescript';
import { minify } from 'uglify-es';

let config = {
    input: process.env.INPUT,
    output: {
        file: process.env.OUTPUT,
        name: 'engine',
        globals: { babylonjs: 'BABYLON' },
        format: 'iife'
    },
    onwarn(warning) {
        // Suppress known error message caused by TypeScript compiled code with Rollup
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }
        console.log("Rollup warning: ", warning.message);
    },
    external: ['babylonjs'],
    plugins: [
        string({
            include: "**/shaders/**/*"
        }),
        typescript({
            typescript: tsc
        })
    ]
};

if (process.env.NODE_ENV == 'production')
    config.plugins.push(uglify(undefined, minify))

export default config;

