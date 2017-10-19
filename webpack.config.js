
let webpack = require("webpack")
let uglify = require("uglifyjs-webpack-plugin")

let conf = {
    entry: "./dist/index.js",
    output: {
        filename: "./dist/build.js"
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({})
    ]
}

if (process.env.NODE_ENV == 'production')
    conf.plugins.push(new uglify())

module.exports = conf

