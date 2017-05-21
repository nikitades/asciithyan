const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

let nodeModules = fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    });


module.exports = [
    {
        name: 'frontend',
        devtool: 'source-map',
        output: {
            path: __dirname + '/../web',
            publicPath: '.',
            filename: 'bundle.js'
        },
        entry: './app_front/app.js',
        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: "json-loader"
                },
                {
                    test: /\.jsx?$/,
                    exclude: [/node_modules/],
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'react', 'stage-2']
                    }
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    loader: 'file-loader?name=/resources/fonts/[name].[ext]'
                },
            ]
        },
        plugins: [
            // new UglifyJSPlugin()
        ]
    },
    {
        name: "backend",
        entry: __dirname + '/../server.js',
        target: 'node',
        output: {
            path: __dirname + '/../dist/',
            filename: 'backend.js'
        },
        node: {
            __dirname: true,
            __filename: true
        },
        externals: [
            function (context, request, callback) {
                let pathStart = request.split('/')[0];
                if (nodeModules.indexOf(pathStart) >= 0 && request != 'webpack/hot/signal.js') {
                    return callback(null, "commonjs " + request);
                }
                callback();
            }
        ],
        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: "json-loader"
                },
                {
                    test: /\.jsx?$/,
                    exclude: [/node_modules/],
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'react', 'stage-2']
                    }
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.(pug)$/,
                    loader: 'pug-loader'
                },
                {
                    test: /\.(node)$/,
                    loader: 'file-loader'
                },
            ]
        },
        plugins: [
            // new UglifyJSPlugin()
        ]
    }
];