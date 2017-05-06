import path from 'path';
import fs from 'fs';

export default (dir) => {
    return (ctx, next) => {
        ctx.controllers = {};
        fs.readdirSync(dir).forEach(file => {
            let fName = path.basename(file, '.js');
            ctx.controllers[fName] = require([dir, file].join('/')).default;
        });
        return next();
    };
};