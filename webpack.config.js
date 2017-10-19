
var webpack = require("webpack")
var Uglify = require("uglifyjs-webpack-plugin")

var conf = {
    entry: "./dist/index.js",
    output: {
        filename: "./dist/build.js"
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({})
    ]
}

if (process.env.NODE_ENV == 'production')
    conf.plugins.push(new Uglify())

module.exports = conf

