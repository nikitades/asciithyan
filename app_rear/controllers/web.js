export default {
    index: (ctx, next) =>
    {
        ctx.body = require('../views/root.pug')();
    },
    submit: (ctx, next) => {
        ctx.body = JSON.stringify(ctx.request.body);
    }
};