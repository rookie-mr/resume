const router = require('koa-router')();
const Db = require('./db.js').instance();
const moment = require('moment');

let wss = {};

// 对话部分的socket链接
router.all('/api/ws/dialog/:id', (ctx) => {
    let id = ctx.params.id
    wss[id] = ctx.websocket;
    if (!ctx.websocket) {
        throw new Error('请将WebSocket注入Context');
    }
    ctx.websocket.send(JSON.stringify({
        message: '链接成功',
        from: 'server',
        to: 'client'
    }));
    ctx.websocket.on('message', (result) => {
        let {
            to,
            message,
            from
        } = JSON.parse(result);
        let m = moment();
        let data = {
            to,
            from,
            message,
            date: {
                string: m.format('YYYY-MM-DD HH:mm:ss'),
                year: m.get('year'),
                month: m.get('month'),
                date: m.get('date'),
                hour: m.get('hour'),
                minute: m.get('minute'),
                second: m.get('second'),
                ms: m.get('millisecond')
            }
        }
        if (wss[to]) {
            wss[to].send(JSON.stringify(data));
        }

    });
})

module.exports = router;