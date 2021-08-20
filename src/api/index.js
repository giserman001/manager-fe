/**
 * api管理
 */
import request from '../utils/request'
export default {
  login(params) {
    return request({ url: '/users/login', method: 'post', data: params })
  },
  noticeCount() {
    return request({ url: '/leave/count', method: 'get', mock: true })
  },
  getMenuList(params) {
    return request({ url: '/menu/list', method: 'get', data: params, mock: false })
  },
  getUserList(params) {
    return request({ url: '/users/list', method: 'get', data: params, mock: false })
  },
  // 获取所有用户列表
  getUserAllList() {
    return request({ url: '/users/all/list', method: 'get', mock: true })
  },
  delUsers(params) {
    return request({ url: '/users/delete', method: 'post', data: params, mock: false })
  },
  getAllRole(params) {
    return request({ url: '/roles/allList', method: 'get', data: params, mock: false })
  },
  getAllDept(params) {
    return request({ url: '/dept/all/list', method: 'get', data: params, mock: true })
  },
  userSubmit(params) {
    return request({ url: '/users/operate', method: 'post', data: params, mock: false })
  },
  menuSubmit(params) {
    return request({ url: '/menu/operate', method: 'post', data: params, mock: false })
  },
  getRoleList(params) {
    return request({ url: '/roles/list', method: 'get', data: params, mock: false })
  },
  roleSubmit(params) {
    return request({ url: '/roles/operate', method: 'post', data: params, mock: false })
  },
  setRolePermission(params) {
    return request({ url: '/roles/update/permission', method: 'post', data: params, mock: false })
  },
  // 获取部门列表
  getDeptList(params) {
    return request({ url: '/dept/list', method: 'get', data: params, mock: true })
  },
  deptSubmit(params) {
    return request({ url: '/dept/operate', method: 'post', data: params, mock: true })
  },
}
