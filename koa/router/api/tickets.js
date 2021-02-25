const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const Db = require('../../db.js').instance();
const config = require('../../config.js');
const utils = require('../../utils.js');
const Name = 'tickets'; // 集合名

router.post('/add', async ctx => {
    let { user, goods, counts } = ctx.request.body;
    await Db.find('goods', {
        _id: Db.ObjectId(goods)
    }).then(async o => {
        if (o.length > 0) {
            await Db.connect().then(async db => {
                let docs = await db.collection(Name).findOneAndUpdate({
                    user,
                    goods,
                    pay: false,
                    ...utils.Omit(o[0], '_id')
                }, {
                    $inc: {
                        'counts': counts
                    },
                }, {
                    upsert: true
                });
                ctx.body = {
                    status: docs.ok,
                    message: docs.ok === 1 ? '添加成功' : '添加失败'
                };
                // await Db.insert(Name, {
                //     user,
                //     goods,
                //     counts,
                //     ...utils.Omit(o[0], '_id')
                // }).then(o => {
                //     ctx.body = {
                //         status: o.ok
                //     };
                // })
            })
        }
    })
})

router.post('/del', async ctx => {
    let query = [];
    let { _id } = ctx.request.body;
    _id.forEach((item, index) => {
        query[index] = {
            _id: Db.ObjectId(item)
        };
    })
    await Db.clear(Name, {
        $or: query
    }).then(o => {
        const result = o.result;
        ctx.body = {
            status: result.ok,
            message: result.ok === 1 ? '删除成功' : '删除失败'
        };
    })
})

router.post('/clear', async ctx => {
    let { _id } = ctx.request.body;
    await Db.clear(Name, {
        user: _id
    }).then(o => {
        const result = o.result;
        ctx.body = {
            status: result.ok,
            message: result.ok === 1 ? '清空成功' : '清空失败'
        };
    })
})

router.post('/find', async ctx => {
    let { _id } = ctx.request.body;
    await Db.find(Name, {
        _id: Db.ObjectId(_id)
    }).then(o => {
        ctx.body = o;
    })
})

router.post('/query', async ctx => {
    let data = ctx.request.body;
    let {
        pageNum,
        pageSize
    } = data;
    let skip = (pageNum - 1) * pageSize;
    // 获取查询字段，剔除分页，处理 _id 字段
    let query = utils.Omit(data, ['pageNum', 'pageSize']);
    await Db.connect().then(async db => {
        let l = await db.collection(Name).find(query).skip(skip).limit(pageSize).toArray();
        let c = await db.collection(Name).countDocuments();
        ctx.body = {
            list: l,
            total: c
        }
    })
})

router.post('/account', async ctx => {
    let { _id, list, counts, total } = ctx.request.body;
    await Db.connect().then(async db => {
        list.forEach(async (item, index) => {
            // query[index] = {
            //     _id: Db.ObjectId(item)
            // };
            await db.collection(Name).findOneAndUpdate({ _id: Db.ObjectId(item) }, {
                $set: {
                    pay: true,
                    counts: counts[index]
                }
            });
        })
        let docs = await db.collection('user').findOneAndUpdate({ _id: Db.ObjectId(_id) }, {
            $inc: {
                'balance': -total
            },
        });
        ctx.body = {
            status: docs.ok,
            message: docs.ok === 1 ? '支付成功' : '支付失败'
        };
    })
    // TODO mongodb中未找到批量设置数据为不同值的方法
    // let query = [];
    // await Db.modify(Name, {
    //     $or: query
    // }, {
    //     pay: true
    // }).then(o => {
    //     const result = o.result;
    //     ctx.body = {
    //         status: result.ok,
    //         message: result.ok === 1 ? '支付成功' : '支付失败'
    //     };
    // })
})

router.post('/buy', async ctx => {
    let { user, goods, counts, price } = ctx.request.body;
    await Db.connect().then(async db => {
        let docs = await db.collection('user').findOneAndUpdate({ _id: Db.ObjectId(user) }, {
            $inc: {
                'balance': -(counts * price)
            },
        });
    })
    await Db.find('goods', {
        _id: Db.ObjectId(goods)
    }).then(async o => {
        if (o.length > 0) {
            await Db.insert(Name, {
                user,
                goods,
                pay: true,
                ...utils.Omit(o[0], '_id')
            }).then(o => {
                const result = o.result;
                ctx.body = {
                    status: result.ok,
                    message: result.ok === 1 ? '支付成功' : '支付失败'
                };
            })
        }
    })
})

module.exports = router;