const IO = require('koa-socket-2');
const io = new IO();

const onconnection = function (ctx, data) {
  console.log(data)
} 

const onmessage = function (ctx, data) {
  console.log(data)
}

module.exports = {
  io,
  onconnection,
  onmessage
}
