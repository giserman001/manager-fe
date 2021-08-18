/**
 * 菜单管理模块
 */
const router = require('koa-router')()
const util = require('../utils/util')
const Menu = require('./../models/menuSchema')
router.prefix('/menu')

// 菜单列表
router.get('/list', async (ctx) => {
  const { menuName, menuState } = ctx.request.query
  let params = {}
  if(menuName) params.menuName = menuName
  if(menuState) params.menuState = menuState
  let rootList = await Menu.find(params) || []
  const list = getTreeMenu(rootList, null, [])
  // const list = getTreeMenu1(rootList, null)
  ctx.body = util.success(list)
})

// 组装菜单结构----1
function getTreeMenu(rootList, id, list) {
  for(let i = 0; i < rootList.length; i++) {
    let item = rootList[i]
    // 这里用slice()原因：防止修改原有对象数据
    // 这里的id属于Oject(yuwqye767wq67e6q7)类型 => 实质属于buffer类型，所以这里用String()转成字符串
    if(String(item.parentId.slice().pop()) == String(id)) {
      // 这里一定要是用_doc去取文档数据。为什么？
      list.push(item._doc)
    }
  }
  list.map(item => {
    item.children = []
    getTreeMenu(rootList, item._id, item.children)
    if(!item.children.length) {
      delete item.children
    } else if(item.children[0].menuType == 2) {
      // 快速区分按钮和菜单，用于后期做菜单按钮权限
      item.action = item.children
    }
  })
  return list
}

// 组装菜单结构----2
function getTreeMenu1(rootList, _id) {
  return rootList.map(item => item.parentId.includes(_id)).forEach(list => {
    let child = getTreeMenu1(rootList, list._id)
    if(child && child.length) {
      list.children = child
    }
  })
}

// 菜单创建/编辑/删除
router.post('/operate', async (ctx) => {
    const { _id, action, ...params } = ctx.request.body
    let res, info
    try {
      if(action === 'add') {
        // 新增有两种方式 1. Menu.create({....}) 2. new Menu({....}).save()
        res = await Menu.create(params)
        info = '创建成功'
      } else if(action === 'edit'){
        // delete params._id
        // delete params.action
        params.updateTime = new Date()
        res = await Menu.findOneAndUpdate(_id, params)
        info = '编辑成功'
      }else{
        res = await Menu.findByIdAndRemove(_id)
        // 包含语法(parentId中包含_id的都删除) 找出关联元素全部删除
        await Menu.deleteMany({ parentId: { $all: [_id] } })
        info = '删除成功'
      }
      ctx.body = util.success('', info)
    } catch (error) {
      ctx.body = util.fail(`${error.stack}`)
    }
})

module.exports = router
