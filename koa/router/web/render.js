const router = require('koa-router')()
const Vue = require('vue')

const template = require('fs').readFileSync('./template/index.template.html', 'utf-8')
const renderer = require('vue-server-renderer').createRenderer({ template })
router.get('/vue-server-render-index', async ctx => {
    const app = new Vue({
        data: {
            url: ctx.url
        },
        template: `<div>访问的 URL 是： {{ url }}</div>`
    })

    const context = {
        title: 'vue ssr',
        metas: `
            <meta name="keyword" content="vue,ssr">
            <meta name="description" content="vue srr demo">
        `,
    }

    renderer.renderToString(app, context, (err, html) => {
        if (err) {
            ctx.body = err
            return
        }
        ctx.body = `${html}`
    })
})

module.exports = router
