const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const Db = require('../../db.js').instance();
const config = require('../../config.js');
const utils = require('../../utils.js');
const Name = 'goods'; // 集合名

router.post('/', async ctx => {
    let data = ctx.request.body;
    let {
        pageNum,
        pageSize
    } = data;
    let skip = (pageNum - 1) * pageSize;
    // 获取查询字段，剔除分页，处理 _id 字段
    let query = Db.Find_id(utils.Omit(data, ['pageNum', 'pageSize']));
    await Db.connect().then(async db => {
        let l = await db.collection(Name).find(query).skip(skip).limit(pageSize).toArray();
        let c = await db.collection(Name).countDocuments();
        ctx.body = {
            list: l,
            total: c
        }
    })
})

router.post('/add', async ctx => {
    let data = ctx.request.body;
    await Db.insert(Name, {
        ...data,
    }).then(o => {
        ctx.body = o;
    })
});

router.post('/del', async ctx => {
    let { _id } = ctx.request.body;
    await Db.remove(Name, {
        _id: Db.ObjectId(_id)
    }).then(o => {
        ctx.body = o;
    })
});

router.post('/edit', async ctx => {
    const data = ctx.request.body;
    const { _id } = data;
    let set = utils.Omit(data, ['_id']);
    await Db.update(Name, {
        _id: Db.ObjectId(_id)
    }, set).then(o => {
        ctx.body = o;
    })
});

router.post('/find', async ctx => {
    let { _id } = ctx.request.body;
    await Db.find(Name, {
        _id: Db.ObjectId(_id)
    }).then(o => {
        ctx.body = o;
    })
});

router.post('/query', async ctx => {
    let data = ctx.request.body;
    let {
        pageNum,
        pageSize,
        category
    } = data;
    let skip = (pageNum - 1) * pageSize;
    // 获取查询字段，剔除分页，处理 _id 字段
    let query = Db.Find_id(utils.Omit(data, ['pageNum', 'pageSize', 'category']));
    await Db.connect().then(async db => {
        let l = await db.collection(Name).find({ ...query, category: { $elemMatch: { $eq: category } } }).skip(skip).limit(pageSize).toArray();
        let c = await db.collection(Name).countDocuments();
        ctx.body = {
            list: l,
            total: c
        }
    })
});

module.exports = router;