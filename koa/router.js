const router = require('koa-router')();
const api = require('./router/api.js');
const wx  = require('./router/wx.js');

router.use('/api', api.routes());
router.use('/wx', wx.routes());

// koa-art-template demo
const render = async (ctx) => {
    await ctx.render('render', {
        name: 'zhanggp',
        password: '123456'
    });
}
router.get('/render', render);

module.exports = router;