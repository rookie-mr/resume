const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const Db = require('../../db.js').instance();
const config = require('../../config.js');
const excel = require('node-excel-export');

router.post('/dialog', async ctx => {
    const _id = ctx.session.UserInfo._id;
    const {
        to,
        user
    } = ctx.request.body;
    // Demo示例 https://www.npmjs.com/package/node-excel-export
    // 更多样式设置 https://github.com/protobi/js-xlsx#cell-styles
    const styles = {
        header: {
            font: {
                sz: 16,
                bold: true
            }
        }
    };
    // 二维数组 值为Object or String
    const heading = [
        [{
            value: '您和' + user.name + '的聊天记录',
            style: styles.header
        }] // or ['您和'+user.name+'的聊天记录']
    ];
    const specification = {
        from: {
            displayName: '发送人',
            headerStyle: styles.header,
            cellFormat: function (value, row) {
                return (value == _id) ? '您说：' : user.name + '说：';
            },
            width: 120
        },
        message: {
            displayName: '内容',
            headerStyle: styles.header,
            width: 300
        },
        date: {
            displayName: '时间',
            headerStyle: styles.header,
            cellFormat: function (value, row) {
                return value.string;
            },
            width: 200
        }
    }
    const merges = [{
        start: {
            row: 1,
            column: 1
        },
        end: {
            row: 1,
            column: 3
        }
    }]
    try {
        await Db.find('dialog', {
            $or: [{
                from: _id,
                to: to
            }, {
                from: to,
                to: _id
            }]
        }).then(o => {
            const report = excel.buildExport(
                [{
                    name: 'Report',
                    heading: heading,
                    merges: merges,
                    specification: specification,
                    data: o
                }]
            );
            ctx.body = report;
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;