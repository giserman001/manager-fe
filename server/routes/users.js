/**
 * 用户管理模块
*/
const router = require('koa-router')()
router.prefix('/users')
const log4js = require('../utils/log4j')

const util = require('../utils/util')
const User = require('./../models/userSchema')

router.post('/login', async(ctx, next) => {
  try {
    // 接收参数
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({ userName, userPwd })
    if(res) {
      ctx.body = util.success(res)
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    log4js.error(error)
    ctx.body = util.fail(`${error}`)
  }
})

module.exports = router
