const router = require('koa-router')();
const Db = require('../../db.js').instance();
const utils = require('../../utils.js');

router.post('/password', async ctx => {
    let {
        name,
        oldPassword,
        newPassword
    } = ctx.request.body;
    let {
        _id
    } = ctx.session.UserInfo
    await Db.connect().then(async db => {
        let docs = await db.collection('user').findOneAndUpdate({
            $or: [{
                _id: Db.ObjectId(_id),
                name,
                password: oldPassword
            }, {
                _id: Db.ObjectId(_id),
                email: name,
                password: oldPassword
            }]
        }, {
            $set: {
                'password': newPassword
            },
        }, {});
        ctx.body = {
            status: docs.ok
        };
    })
});

router.post('/address', async ctx => {
    let {
        level
    } = ctx.request.body;
    const keys = ['', 'p_num', 'city_num', 'county_num', 'town_num', 'details_num']; // 省、市、区（县）、镇（街道）、地址 编码字段
    await Db.find('address').then(o => {
        if (level === 5) {
            ctx.body = o;
            return;
        } else {
            level = level ? level : 3; // 默认返回三级
            let _keys = []; // 已遍历的key
            let result = [];
            o.forEach((item, index) => {
                if (_keys.indexOf(item[keys[level]]) === -1) {
                    _keys.push(item[keys[level]]);
                    let temp = {};
                    temp = {
                        ID: item.ID,
                        province: item.province,
                        p_num: item.p_num,
                    };
                    if (level === 2) {
                        temp.city_name = item.city_name;
                        temp.city_num = item.city_num;
                    }
                    if (level === 3) {
                        temp.county_name = item.county_name;
                        temp.county_num = item.county_num;
                    }
                    if (level === 4) {
                        temp.town__name = item.town__name;
                        temp.town_num = item.town_num;
                    }
                    result.push(temp);
                }
            })
            ctx.body = result;
            return;
        }
    })
});

module.exports = router;