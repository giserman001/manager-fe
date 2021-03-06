/**
 * 通用工具函数
 */
const jwt = require('jsonwebtoken')
const log4js = require('../utils/log4j')
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, // 参数错误
  USER_ACCOUNT_ERROR: 20001, // 账号或者密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登录
  BUSINESS_ERROR: 40001, // 业务请求失败
  AUTH_ERROR: 50001, // 认证失败或TOKEN过期
}

module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum 页码
   * @param {number} pageSize 每个页面数据个数
   */
  pager({ pageNum = 1, pageSize = 10 }) {
    // 转化为数字
    pageNum *= 1
    pageSize *= 1
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: {
        pageNum,
        pageSize,
      },
      skipIndex,
    }
  },
  success(data = '', msg = '', code = CODE.SUCCESS) {
    log4js.debug(`数据库返回值=>${JSON.stringify(data)}`)
    return { code, data, msg }
  },
  fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
    log4js.debug(msg)
    return { code, data, msg }
  },
  CODE,
  decoded(authorization) {
    if(authorization) {
      const token = authorization.split(' ')[1]
      return jwt.verify(token, 'imooc')
    }
    return ''
  },
  getTreeMenu(rootList, _id) {
    return rootList.filter(item => String(item.parentId.slice().pop()) == String(_id)).map(list => {
      list = Object.assign({}, list._doc)
      let child = this.getTreeMenu(rootList, list._id)
      if(child && child.length) {
        list.children = child
      }
      if(list.children && list.children[0].menuType == 2) {
        list.action = list.children
      }
      return list
    })
  }
}
