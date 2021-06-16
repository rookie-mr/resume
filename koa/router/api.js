const router = require('koa-router')();

const index = require('./web/index.js');
const render = require('./web/render.js');

const setting = require('./api/setting.js');
const login = require('./api/login.js');
const user = require('./api/user.js');
const role = require('./api/role.js');
const menu = require('./api/menu.js');
const dialog = require('./api/dialog.js');
const upload = require('./api/upload.js');
const download = require('./api/download.js');
const category = require('./api/category.js');
const config = require('./api/config.js');
const goods = require('./api/goods.js');
const tickets = require('./api/tickets.js');
const ebook = require('./api/ebook.js');
const address = require('./api/address.js');
const codegen = require('./api/codegen.js');

const shop = require('./api/shop.js');

// 主页接口
router.use('/index', index.routes());
router.use('/render', render.routes());

// 管理系统接口
router.use('/setting', setting.routes());
router.use('/login', login.routes());
router.use('/users', user.routes());
router.use('/roles', role.routes());
router.use('/menus', menu.routes());
router.use('/dialog', dialog.routes());
router.use('/upload', upload.routes());
router.use('/download', download.routes());
router.use('/category', category.routes());
router.use('/config', config.routes());
router.use('/goods', goods.routes());
router.use('/tickets', tickets.routes());
router.use('/ebook', ebook.routes());
router.use('/address', address.routes());
router.use('/codegen', codegen.routes());

// 业务
router.use('/shops', shop.routes());

module.exports = router;