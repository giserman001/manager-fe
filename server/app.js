const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
const log = require('log4js')
const users = require('./routes/users')
const log4js = require('./utils/log4j')
const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
require('./config/db')
const utils = require('./utils/util')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 参数日志
app.use(async (ctx, next) => {
  log4js.info(`get params:${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params:${JSON.stringify(ctx.request.body)}`)
  await next().catch(err => {
    if(err.status == '401') {
      ctx.status = 200
      ctx.body = utils.fail('Token认证失败', utils.CODE.AUTH_ERROR)
    } else {
      throw err
    }
  })
})

app.use(koajwt({secret: 'imooc'}).unless({
  // 去除不要toekn验证的接口
  path: ['/api/users/login']
}))
// routes
// 挂载一级路由
router.prefix('/api')
router.use(users.routes(), users.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app
