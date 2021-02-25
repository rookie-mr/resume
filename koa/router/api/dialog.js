// TODO 无论是stream或修改body都不能运用发布订阅形式来修改返回

const event = require('events');
const router = require('koa-router')();
const moment = require('moment');
const {
    Duplex
} = require('stream');
const Db = require('../../db.js').instance();
const Name = 'dialog';

// 模块方法
const EventEmitter = new event.EventEmitter();

// 双工流创建可读写的流作为响应主体
const duplex = new Duplex({
    read(size) {

    },
    write(chunk, encoding, callback) {

    }
});
const sse = (stream, event, data) => {
    return stream.push(`retry: 360000\nevent:${ event }\ndata: ${ data }\n\n`);
    // return stream.write(`event:${ event }\ndata: ${ data }\n\n`);
}

// 取消最大监听器的限制
EventEmitter.setMaxListeners(0);

router.get('/', async ctx => {
    let {
        _id,
        name
    } = ctx.session.UserInfo;
    let stream = new Duplex({
        read(size) {
            console.log('数据被读取了');
        },
        write(chunk, encoding, callback) {
            console.log('数据被修改了');
        }
    });

    ctx.status = 200;
    ctx.set({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    EventEmitter.on('send-to-' + _id, (data) => { // 接收消息的订阅
        // ctx.body += "event: receive\ndata: " + data + "\n\n";
        console.log(name, '-接收到消息');
        sse(stream, 'receive', data);
    });

    // ctx.body = "retry: 360000\nevent: \ndata:会话连接成功!\n\n";
    // ctx.body += "event: receive\ndata:" + JSON.stringify({
    //     "message": "zhanggp to admin",
    //     "from": "5df64ca405bd4319e4ebcdcb",
    //     "to": "5e5b84d286b3d9239c0b61c1"
    // }) + "\n\n";

    sse(stream, 'receive', JSON.stringify({
        "message": "zhanggp to admin",
        "from": "5df64ca405bd4319e4ebcdcb",
        "to": "5e5b84d286b3d9239c0b61c1"
    }));

    ctx.body = stream;
});

router.post('/send', async ctx => {
    let {
        to,
        message
    } = ctx.request.body;
    let from = ctx.session.UserInfo._id;
    let m = moment();
    let data = {
        message,
        from,
        to,
        date: {
            string: m.format('YYYY-MM-DD HH:mm:ss'),
            year: m.get('year'),
            month: m.get('month'),
            date: m.get('date'),
            hour: m.get('hour'),
            minute: m.get('minute'),
            second: m.get('second'),
            ms: m.get('millisecond')
        }
    };
    await Db.insert(Name, data).then(o => {
        // EventEmitter.emit('send-to-' + to, JSON.stringify(data));
        ctx.body = {
            ...data,
            type: 'send',
        }
    })
});

router.post('/previous', async ctx => {
    let {
        _id,
        to
    } = ctx.request.body;
    await Db.find(Name, {
        $or: [{
            from: _id,
            to: to
        }, {
            from: to,
            to: _id
        }]
    }).then(o => {
        ctx.body = o;
    })
});

module.exports = router;