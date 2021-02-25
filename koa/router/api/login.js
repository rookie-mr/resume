const router = require('koa-router')();
const Db = require('../../db.js').instance();
const JWT = require('jsonwebtoken');
const { secret } = require('../../config.js');

router.post('/', async ctx => {
    const {
        userName,
        password
    } = ctx.request.body;
    let result = {};
    await Db.find('user', {
        $or: [{
            name: userName,
            password
        }, {
            email: userName,
            password
        }]
    }).then(o => {
        result = o.length > 0 ? (o.length > 1 ? {
            status: -1,
            tips: '用户异常不允许登录'
        } : {
                status: 1,
                ...o[0]
            }) : {
                status: 0,
                tips: '用户名或密码错误！'
            };
    })
    if (result.status === 1) {
        // 有效用户，从角色表获取权限
        let {
            roles
        } = result;
        await Db.find('roles', {
            name: roles
        }).then(o => {
            o[0] ? (result.permissions = o[0].permissions) : result.permissions = [];
            ctx.session.UserInfo = result;
            // 时间设置说明
            // Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. 
            // If you use a string be sure you provide the time units (days, hours, etc), 
            // otherwise milliseconds unit is used by default ("120" is equal to "120ms").
            const token = JWT.sign({ _id: result._id }, secret, { expiresIn: 3600 });
            ctx.body = { token, ...result };
        })
    } else {
        ctx.body = result;
    }
});

module.exports = router;