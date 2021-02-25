const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const Db = require('../../db.js').instance();
const config = require('../../config.js');
const utils = require('../../utils.js');

router.post('/get', async ctx => {
    let list = [];
    const dir = fs.readdirSync(path.join(__dirname + '/../../../files/ebook'));
    dir.forEach(item => {
        list.push({
            path: `http://${config.host}:${config.port}/ebook/${item}`,
            name: item
        })
    });
    ctx.body = list;
})

router.post('/remove', async ctx => {
    let {name} = ctx.request.body;
    const p = path.join(__dirname + '/../../../files/ebook/' + name)
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

module.exports = router;