const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: '../koa.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  target: 'node',
  resolve: {
    extensions: ['.js']
  },
  externals: [nodeExternals()],
  context: __dirname,
  plugins: [
		new CleanWebpackPlugin({
			root: path.resolve(__dirname, '../dist')
		}),
	]
}