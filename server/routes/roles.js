/**
 * 角色管理模块
 */
const router = require('koa-router')()
const util = require('../utils/util')
const Role = require('./../models/roleSchema')
router.prefix('/roles')

// 查询所有的角色列表
router.get('/allList', async (ctx) => {
  try {
    const list = await Role.find({}, '_id roleName')
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`)
  }
})

// 带有分页功能的角色列表
router.get('/list', async (ctx) => {
  const { roleName } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  try {
    let params = {}
    if (roleName) params.roleName = roleName
    const query = Role.find(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    // 查询总条数
    const total = await Role.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`)
  }
})

// 角色创建/编辑/删除
router.post('/operate', async (ctx) => {
  const { _id, action, roleName, remark } = ctx.request.body
  let res, info
  if (!action) {
    ctx.body = util.fail(`参数action必填`, util.CODE.PARAM_ERROR)
    return
  }
  try {
    if (action == 'create') {
      if (!roleName) {
        ctx.body = util.fail(`参数roleName必填`, util.CODE.PARAM_ERROR)
        return
      }
      res = await Role.create({ roleName, remark })
      info = '创建成功'
    }
    if (action == 'edit') {
      if (!_id) {
        ctx.body = util.fail(`参数_id必填`, util.CODE.PARAM_ERROR)
        return
      }
      res = await Role.findByIdAndUpdate(_id, { roleName, remark, updateTime: new Date() })
      info = '编辑成功'
    }
    if (action == 'delete') {
      if (!_id) {
        ctx.body = util.fail(`参数_id必填`, util.CODE.PARAM_ERROR)
        return
      }
      res = await Role.findByIdAndRemove(_id)
      info = '删除成功'
    }
    ctx.body = util.success(res, info)
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`)
  }
})

// 角色权限设置

router.post('/update/permission', async (ctx) => {
  const { _id, permissionList } = ctx.request.body
  try {
    let res = await Role.findByIdAndUpdate(_id, { permissionList, updateTime: new Date() })
    ctx.body = util.success(res, '权限设置成功')
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`)
  }
})
module.exports = router
