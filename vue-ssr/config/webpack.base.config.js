const arguments = process.argv.splice(2);
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    output: {
        // filename: 'bindle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            { test: /\.vue$/, use: 'vue-loader' }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}