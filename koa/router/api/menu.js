const router = require('koa-router')();
const Db = require('../../db.js').instance();
const utils = require('../../utils.js');
const Name = 'menu'; // 集合名

router.get('/', async ctx => {
    const {
        UserInfo
    } = ctx.session;
    const {
        permissions,
    } = UserInfo;
    await Db.find(Name, {
        key: {
            $in: permissions
        }
    }).then(o => {
        ctx.body = o;
    })
})

router.get('/all', async ctx => {
    await Db.find(Name, {}).then(o => {
        ctx.body = o;
    })
})

// TODO 需修改生成key的处理机制，如果多用户同一毫秒内新增菜单可能导致生成一致的key
router.post('/add', async ctx => {
    let data = ctx.request.body;
    await Db.insert(Name, {
        ...data,
        key: new Date().getTime().toString()
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

module.exports = router;