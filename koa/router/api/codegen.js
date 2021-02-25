const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const xlsx = require('node-xlsx');
const mysql = require('mysql');
const config = require('../../config.js');
const utils = require('../../utils.js');

router.post('/parse', async ctx => {
  const body = ctx.request.body;
  const map = JSON.parse(body.map);
  const file = ctx.request.files.file; // 获取上传文件
  const data = xlsx.parse(file.path);
  let result = [];

  // excel的第一个sheet TODO 多sheet的处理
  const sheet = data[0].data;
  // 表头
  const columns = sheet[0];
  // 表头对应的key
  let keys = []
  // 设置columns值
  let head = {

  }
  columns.forEach(item => {
    head[map[item] || item] = '';
    keys.push(map[item] || item)
  })
  // 表内容
  const content = sheet.slice(1);
  content.forEach(row => {
    let o = { ...head }
    row.forEach((item, index) => Object.assign(o, { [keys[index]]: item }))
    result.push(o);
  })

  ctx.body = result
})

router.post('/dblink', async ctx => {
  const body = ctx.request.body;
  const { type, name } = body;
  switch (type) {
    case 'mysql':
      const connection = mysql.createConnection({
        host: body.host,
        port: body.port,
        user: body.user,
        password: body.secret,
        database: body.name
      })
      try {
        connection.connect()
      } catch (error) {
        ctx.body = { error }
      }
      let arr = new Array()
      let o = {}

      // 将connection.query封装为promise
      function query(key, conn) {
        return new Promise((resolve, reject) => {
          conn.query(key, function(error, results, fields) {
            resolve({ error, results, fields })
          })
        })
      }

      await query('show tables', connection).then(async ({ results }) => {
        if (results) {
          for (var i = 0; i < results.length; i++) {
            arr[i] = results[i];
            const a = arr[i];
            let temp = '';
            temp += a[`Tables_in_${name}`];
            await query('select * from' + ' ' + temp, connection).then(({ fields }) => {
              o[a[`Tables_in_${name}`]] = fields
            })
          }
        }
      })

      // 同步形式前端404
      // connection.query('show tables', function (error, results) {
      //   if (error) {
      //     ctx.body = { error }
      //   }
      //   if (results) {
      //     for (var i = 0; i < results.length; i++) {
      //       arr[i] = results[i];
      //       const a = arr[i];
      //       let temp = '';
      //       temp += a[`Tables_in_${name}`];
      //       connection.query('select * from' + ' ' + temp, function (error, result, fields) {
      //         console.log(error)
      //         o[a[`Tables_in_${name}`]] = fields
      //       })
      //     }
      //   }
      // })
      connection.end()
      ctx.body = o
  }
})

router.post('/vue/template', async ctx => {
  let list = [];
  const dir = fs.readdirSync(path.join(__dirname + '/../../../template/vue'));
  dir.forEach(item => {
      list.push(`http://${config.host}:${config.port}/template/${item}`)
  });
  ctx.body = list;
})

router.post('/upload/template', async ctx => {
  const file = ctx.request.files.file; // 获取上传文件
  const type = ctx.request.body.type;
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let name = utils.GetKey(36, 10) + '-' + new Date().getTime() + '-' + file.name;
  let filePath = path.join(__dirname, `../../../template/${type}/`) + name;
  // 创建可写流
  const stream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(stream);
  ctx.body = {
      status: 1,
      message: '模板上传成功！',
      path: `http://${config.host}:${config.port}/template/${name}`
  };
})

router.post('/create', async ctx => {
  const { type, name, template, data } = ctx.request.body
  let filePath = path.join(__dirname, `../../../template/${type.toLowerCase()}/${template}`);
  // 创建可读流
  let reader = fs.createReadStream(filePath);
  await new Promise((resolve, reject) => {
    let chunk = []
    reader.on('data', function(data) {
      chunk.push(data)
    })
    reader.on('end', function() {
      resolve(chunk)
    })
  }).then((chunk) => {
    let fields = JSON.parse(data).fields;
    s = utils.SSRParse(chunk, fields);
    ctx.body = s;
  })
})

module.exports = router;