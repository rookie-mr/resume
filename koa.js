const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const util = require('util');

const Koa = require('koa');
const parser = require('koa-body');
const static = require('koa-static');
const render = require('koa-art-template');
const session = require('koa-session');
const websocket = require('koa-websocket');
const sslify = require('koa-sslify').default; // http强制https
const logger = require('koa-logger');

// JWT认证
const JWT = require('jsonwebtoken');
const JWTKoa = require('koa-jwt');
const verify = util.promisify(JWT.verify);

const app = websocket(new Koa());
const router = require('./koa/router.js');
const ws = require('./koa/ws.js');
const config = require('./koa/config.js');

// socket 链接
const { io, onmessage, onconnection, srouter } = require('./koa/socket');

const options = {
    key: fs.readFileSync('./4805274_zhanggp.top.key'),  // 私钥文件路径
    cert: fs.readFileSync('./4805274_zhanggp.top.pem')  // 证书文件路径
};

app.keys = config.keys;

// koa cookie 设置中文需将中文先转化为base64

// koa-art-template
render(app, {
    root: path.join(__dirname, '/template'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

// app.use(logger());
// app.use(sslify());

app.use(parser({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(session(config.session, app));
app.use(static(path.join(__dirname + '/static')));
app.use(static(path.join(__dirname + '/files')));

// 默认将所有接口放行 TODO 默认将所有接口放行，系统涉及接口过多，在下方验证需要验证的接口
app.use(JWTKoa({ secret: config.secret, passthrough: true }).unless({
    path: [] // 数组中的路径不需要通过JWT验证 Eg: [/^\/api\/login/]
}))

// 用户认证，不同平台接入不同的认证机制
app.use(async (ctx, next) => {
    // 抛出错误或成功响应根据状态码判断
    const { authentication } = ctx.request.headers;
    switch (authentication) {
        case 'JWT': // JWT（JSON Web Token） 认证，APP小程序等不支持cookie环境认证
            const token = ctx.request.headers[config.TokenKey];
            if (config.JWTAccess.indexOf(ctx.url) === -1) { // 不涉及JWT认证的接口直接跳过

            } else {
                try {
                    let payload = await verify(token.split(' ')[1], config.secret);
                } catch (error) {
                    if (error.name) {
                        switch (error.name) {
                            case 'TokenExpiredError': // 超时
                                ctx.throw(401, '长时间未登录，请重新登录！');
                                break;
                            case 'JsonWebTokenError': // Token有误
                                ctx.throw(401, '请先登录！');
                                break;
                            case 'NotBeforeError':
                                ctx.throw(401, error.message);
                                break;
                            default:
                                ctx.throw(401, error.message);
                                break;
                        }
                    }
                    ctx.throw(401);
                }
            }
            await next();
            break;
        default:  // 类似shiro的认证机制
            // 处理路径，删除hash和get的参数
            let url = ctx.url;
            let hash = url.indexOf('#');
            let query = url.indexOf('?');
            if (hash !== -1) {
                url = url.slice(0, hash - 1);
            }
            if (query !== -1) {
                url = url.slice(0, query);
            }
            if (url.endsWith('/')) url = url.slice(0, -1);

            if (config.DirectAccess.indexOf(url) !== -1) {
                await next();
            } else {
                if (!ctx.session.UserInfo) {
                    ctx.throw(401);
                } else {
                    await next();
                }
            }
            break;
    }
});

// io.attach(app);
// io.on('connection', onconnection);
// io.on('message', onmessage);

app.use(router.routes());
app.use(router.allowedMethods());
app.ws.use(ws.routes());

/**
 * HTTP
 */
app.listen(config.port);
// http.createServer(app.callback()).listen(config.port);

/**
 * HTTPS
 */
https.createServer(options, app.callback()).listen(443);
console.log('port:' + config.port);