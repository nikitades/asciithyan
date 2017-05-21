import pug from 'js-koa-pug';
import serve from 'koa-static';
import body from 'koa-body';
import {MongoClient} from 'mongodb';
import controllers from './middleware_controllers';
import err from './middleware_errors';
import router from './router_http';

export default async (app) => {
    app.keys = ['name123', 'i like turtle'];
    app.use((ctx, next) => {
        ctx.app = app;
        return next();
    });
    app.use(body({
        formidable: {
            uploadDir: _root + '/storage/uploads'
        },
        multipart: true,
        urlencoded: true
    }));
    app.use(pug(_root + '/app_rear/views'));
    app.use(serve(_root + '/web'));
    app.use(err);
    app.use(controllers);
    app.use(router.routes());
    app.db = await MongoClient.connect('mongodb://localhost:27017/asciithyan');
}
