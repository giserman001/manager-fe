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
  getPermissionList() {
    return request({ url: '/users/getPermissionList', method: 'get', mock: false })
  },
  getUserList(params) {
    return request({ url: '/users/list', method: 'get', data: params, mock: false })
  },
  // 获取所有用户列表
  getUserAllList() {
    return request({ url: '/users/all/list', method: 'get', mock: false })
  },
  delUsers(params) {
    return request({ url: '/users/delete', method: 'post', data: params, mock: false })
  },
  getAllRole(params) {
    return request({ url: '/roles/allList', method: 'get', data: params, mock: false })
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
  getAllDept(params) {
    return request({ url: '/dept/list', method: 'get', data: params, mock: false })
  },
  deptSubmit(params) {
    return request({ url: '/dept/operate', method: 'post', data: params, mock: false })
  },
}
