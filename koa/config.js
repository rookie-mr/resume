module.exports = {
    // 项目配置
    host: '127.0.0.1',
    port: 80,
    keys: ['some secret here'],
    // 数据库
    db: {
        path: '127.0.0.1',
        port: '27017',
        name: 'resume',
    },
    // koa-session 设置
    session: {
        key: 'koa:sess',
        maxAge: 86400000,
        autoCommit: true,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: true,
        renew: false,
        sameSite: null,
    },
    DirectAccess: ['/message', '/api/login', '/socket.io', '/wx'], // shiro认证 直接访问接口，无需校验登录状态
    JWTAccess: ['/api/users/find', '/api/upload/avatar', '/api/tickets', '/api/tickets/add', '/api/tickets/query'], // JWT 验证的接口
    TokenKey: 'authorization', // JWT 认证的Key,
    secret: 'some secret here',
    wx: {
        Token: 66666666
    }
}