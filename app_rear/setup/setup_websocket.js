import sio from 'socket.io';
import wsr from './router_websocket';

export default (app) => {
    app.io = sio(app.server);
    wsr(app);
    app.use((ctx, next) => ctx.io = app.io);
}