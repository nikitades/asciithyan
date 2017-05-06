export default {
    index: (ctx, next) =>
    {
        ctx.render('root');
    },
    submit: (ctx, next) => {
        ctx.body = JSON.stringify(ctx.request.body);
    }
};