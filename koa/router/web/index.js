const router = require('koa-router')();
const Db = require('../../db.js').instance();
const moment = require('moment');

router.post('/message', async ctx => {
    let data = ctx.request.body;
    await Db.insert('message', {
        ...data,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
    }).then(o => {
        ctx.body = 'succ';
    })
});

module.exports = router;