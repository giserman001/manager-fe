/**
 * 用户管理模块
*/
const router = require('koa-router')()
router.prefix('/users')
const log4js = require('../utils/log4j')

const util = require('../utils/util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userSchema')

router.post('/login', async(ctx, next) => {
  try {
    // 接收参数
    const { userName, userPwd } = ctx.request.body
    /**
     * 三种方式返回指定字段
     * 1. 'userId userName userEmail state role deptId roleList'
     * 2. {userId: 1, userName: 1} 其中1代表返回 0 代表不返回
     * 3. select('userId')
    */
    const res = await User.findOne({ userName, userPwd }, 'userId userName userEmail state role deptId roleList')
    const data = res._doc
    const token = jwt.sign({
      data
    }, 'imooc', { expiresIn: '1h' })
    if(res) {
      ctx.body = util.success({...data, token})
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    log4js.error(error)
    ctx.body = util.fail(`${error}`)
  }
})

module.exports = router
