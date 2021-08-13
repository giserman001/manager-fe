/**
 * 数据库配置
 */
const config = require('./index')
const log4js = require('../utils/log4j')
const mongoose = require('mongoose')
// 消除对findOneAndUpdate使用的警告
mongoose.set('useFindAndModify', false)

mongoose.connect(config.URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('open', () => {
  log4js.info('****数据库连接成功****')
})

db.on('error', () => {
  log4js.error('****数据库连接失败****')
})
