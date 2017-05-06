const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
    {
        name: 'frontend',
        devtool: 'source-map',
        output: {
            path: __dirname + '/../web/js',
            publicPath: '/js',
            filename: 'bundle.js'
        },
        entry: './app_front/app.js',
        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: "json"
                },
                {
                    test: /\.jsx?$/,
                    exclude: [/node_modules/],
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    loader: 'file-loader?name=/resources/assets/fonts/[name].[ext]'
                },
            ]
        },
        plugins: [
            // new UglifyJSPlugin()
        ]
    },
    {
        name: 'backend',
        output: {
            path: __dirname + '/../',
            publicPath: __dirname + '/../'
        }
    }
];