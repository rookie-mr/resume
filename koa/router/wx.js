const router = require('koa-router')();
const { wx } = require('../config.js');
const crypto = require('crypto');

router.get('/', async ctx => {
  let {
    signature,
    timestamp,
    nonce,
    echostr
  } = ctx.request.query;
  const token = wx.Token;
  const s = [timestamp, nonce, token].sort().join('');
  const res = crypto.createHash('sha1').update(s).digest('hex') === signature ? echostr : false;

  ctx.body = res;
});

module.exports = router;