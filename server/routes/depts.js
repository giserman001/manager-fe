/**
 * 部门管理模块
 */
const router = require('koa-router')()
const util = require('../utils/util')
const Dept = require('./../models/deptSchema')
router.prefix('/dept')


// 组装部门结构
function getTreeDept(rootList, _id) {
    return rootList.filter(item => String(item.parentId.slice().pop()) == String(_id)).map(list => {
        list = Object.assign({}, list._doc)
        let child = getTreeDept(rootList, list._id)
        if (child && child.length) {
            list.children = child
        }
        return list
    })
}
// 部门列表
router.get('/list', async (ctx) => {
    const { deptName } = ctx.request.query
    try {
        let params = {}
        if (deptName) params.deptName = deptName
        const rootList = await Dept.find(params)
        if (deptName) {
            ctx.body = util.success(rootList)
        } else {
            const list = getTreeDept(rootList, null)
            ctx.body = util.success(list)
        }
    } catch (error) {
        ctx.body = util.fail(`${error.stack}`)
    }
})

// 部门创建/编辑/删除
router.post('/operate', async (ctx) => {
    const { _id, action, ...params } = ctx.request.body
    let info
    if (!action) {
        ctx.body = util.fail(`参数action必填`, util.CODE.PARAM_ERROR)
        return
    }
    try {
        if (action == 'create') {
            if (!params.deptName) {
                ctx.body = util.fail(`参数deptName必填`, util.CODE.PARAM_ERROR)
                return
            }
            await Dept.create(params)
            info = '创建成功'
        }
        if (action == 'edit') {
            if (!_id) {
                ctx.body = util.fail(`参数_id必填`, util.CODE.PARAM_ERROR)
                return
            }
            await Dept.findByIdAndUpdate(_id, { ...params, updateTime: new Date() })
            info = '编辑成功'
        }
        if (action == 'delete') {
            if (!_id) {
                ctx.body = util.fail(`参数_id必填`, util.CODE.PARAM_ERROR)
                return
            }
            await Dept.findByIdAndRemove(_id)
            // 包含语法(parentId中包含_id的都删除) 找出关联元素全部删除
            await Dept.deleteMany({ parentId: { $all: [_id] } })
            info = '删除成功'
        }
        ctx.body = util.success('', info)
    } catch (error) {
        ctx.body = util.fail(`${error.stack}`)
    }
})
module.exports = router
