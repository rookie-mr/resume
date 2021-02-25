const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const Db = require('../../db.js').instance();
const config = require('../../config.js');
const utils = require('../../utils.js');

router.post('/avatar', async ctx => {
    const {
        _id
    } = ctx.request.body || ctx.session.UserInfo;
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let name = _id + path.extname(file.name);
    let filePath = path.join(__dirname, '../../../files/avatar/') + name;
    // 创建可写流
    const stream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(stream);
    await Db.update('user', {
        _id: Db.ObjectId(_id)
    }, { avatar: `http://${config.host}:${config.port}/avatar/${name}` }).then(o => {})
    ctx.body = {
        status: 1,
        message: '头像上传成功！',
        path: `http://${config.host}:${config.port}/avatar/${name}`
    };
})

router.post('/carousel', async ctx => { // 幸运盒首页轮播
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let name = utils.GetKey(36, 10) + '-' + new Date().getTime() + path.extname(file.name);
    let filePath = path.join(__dirname, '../../../files/carousel/') + name;
    // 创建可写流
    const stream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(stream);
    ctx.body = {
        status: 1,
        message: '头像上传成功！',
        path: `http://${config.host}:${config.port}/carousel/${name}`
    };
})

module.exports = router;