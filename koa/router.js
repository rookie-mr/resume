const router = require('koa-router')();
const api = require('./router/api.js');

router.use('/api', api.routes());

// koa-art-template demo
const render = async (ctx) => {
    await ctx.render('render', {
        name: 'zhanggp',
        password: '123456'
    });
}
router.get('/render', render);

module.exports = router;