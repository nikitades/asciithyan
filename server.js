"use strict";
import "babel-core/register";
import "babel-polyfill";

import http from 'http';
import Koa from 'koa';
import config from './config/config';
import general_setup from './app_rear/setup/setup_general';
import websocket_setup from './app_rear/setup/setup_websocket';

const app = new Koa();
app.server = http.createServer(app.callback());
global._root = __dirname;

general_setup(app);
websocket_setup(app);

if (!module.parent) {
    app.server.listen(config.app.port);
    console.log("Server started, listening on port: " + config.app.port);
}
console.log("Environment: " + config.app.env);