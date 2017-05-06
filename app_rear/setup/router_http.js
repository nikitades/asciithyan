import Router from 'koa-router';
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.controllers.web.index(ctx, next);
});

router.post('/submit', (ctx, next) => {
    ctx.controllers.web.submit(ctx, next);
});

export default router;