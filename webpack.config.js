const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'production',
	optimization: {
		concatenateModules: true,
		minimize: true,
	},
	entry: {
		main: path.resolve(__dirname, './assets/scripts/index.js'),
	},
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'public'),
	},
	plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
	devServer: {
		historyApiFallback: true,
		contentBase: path.resolve(__dirname, '/public'),
		open: true,
		compress: true,
		hot: true,
		port: 1337,
	},
};
