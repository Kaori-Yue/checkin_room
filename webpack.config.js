const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = require('./env.json');

module.exports = {
	entry: './dashboard/src/index.js',
	output: {
		path: path.join(__dirname, "/dashboard/dist"),
		filename: 'bundle.js',
		publicPath: "/admin",

		chunkFilename: '[name].chunk.js',

	},
	
	optimization: {
		splitChunks: {
			chunks: 'all',
			name: false,
		},
	},



	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: [
							["@babel/plugin-transform-runtime",
								{
									"regenerator": true
								}
							]
						]
					}
				}
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			}
		]
	},
	devServer: {
		host: env.HOST,
		port: 8181,
		// historyApiFallback: true,
		historyApiFallback: {
			index: '/admin'
		},
		// contentBasePublicPath: '/dashboard/public'
		contentBase: path.join(__dirname, 'dashboard/public')
		
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './dashboard/public/index.html',
			favicon: './dashboard/public/favicon.ico'
		})
	]
}
