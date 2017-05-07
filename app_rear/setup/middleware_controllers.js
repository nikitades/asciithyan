

export default (ctx, next) => {
    ctx.controllers = {
        web: require('../controllers/web')['default']
    };
    return next();
};