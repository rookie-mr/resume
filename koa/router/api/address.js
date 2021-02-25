const router = require('koa-router')();
const Db = require('../../db.js').instance();
const utils = require('../../utils.js');
const Name = 'shipping-address';

router.post('/', async ctx => {
    let {
        _id
    } = ctx.request.body;
    await Db.find(Name, {
        user: _id
    }).then(o => {
        ctx.body = o;
    })
});

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

module.exports = router;