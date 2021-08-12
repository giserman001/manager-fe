/**
 * 用户管理模块
 */
const router = require('koa-router')()
router.prefix('/users')
const log4js = require('../utils/log4j')

const util = require('../utils/util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userSchema')

// 登陆
router.post('/login', async (ctx) => {
  try {
    // 接收参数
    const { userName, userPwd } = ctx.request.body
    /**
     * 三种方式返回指定字段
     * 1. 'userId userName userEmail state role deptId roleList'
     * 2. {userId: 1, userName: 1} 其中1代表返回 0 代表不返回
     * 3. select('userId')
     */
    const res = await User.findOne(
      { userName, userPwd },
      'userId userName userEmail state role deptId roleList'
    )
    const data = res._doc
    const token = jwt.sign({ data }, 'imooc', { expiresIn: '1h' })
    if (res) {
      ctx.body = util.success({ ...data, token })
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`)
  }
})

// 登陆
router.get('/list', async (ctx) => {
  try {
    // 接收参数
    const { userId, userName, state } = ctx.request.query
    const { page, skipIndex } = util.pager(ctx.request.query)
    let params = {}
    if (userId) params.userId = userId
    if (userName) params.userName = userName
    if (state && state != '0') params.state = state
    // 根据条件查询数据库所有的用户，排除"_id", "userPwd"这两个字段
    const query = User.find(params, { _id: 0, userPwd: 0 })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    // 获取总条数
    // 方法1：
    // const total = list.length
    // 方法2：
    const total = await User.countDocuments(params)
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

module.exports = router
