const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const Db = require('../../db.js').instance();
const config = require('../../config.js');
const utils = require('../../utils.js');
const Name = 'config'; // 集合名

router.post('/get/carousel', async ctx => {
    let list = [];
    const dir = fs.readdirSync(path.join(__dirname + '/../../../files/carousel'));
    dir.forEach(item => {
        list.push(`http://${config.host}:${config.port}/carousel/${item}`)
    });
    ctx.body = list;
})

router.post('/remove/carousel', async ctx => {
    let {name} = ctx.request.body;
    const p = path.join(__dirname + '/../../../files/carousel/' + name)
    if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        ctx.body = {
            status: 1,
            message: name + '已删除！'
        };
    } else {
        ctx.body = '文件不存在！'
    }
})

router.post('/set', async ctx => {
    let data = ctx.request.body;
    if (data.key) {
        await Db.update(Name, { key: data.key }, data, { upsert: true }).then(o => {
            ctx.body = o;
        })
    } else {
        ctx.body = '更新失败，原因：未传递正确的参数key';
    }
})

router.post('/get', async ctx => {
    let { key } = ctx.request.body;
    if (key) {
        await Db.find(Name, {
            key
        }).then(o => {
            ctx.body = o;
        })
    } else {
        ctx.body = '获取失败，原因：未传入正确的参数key';
    }
})

module.exports = router;