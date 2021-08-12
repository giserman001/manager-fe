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
  getMenuList() {
    return request({ url: '/menu/list', method: 'get', mock: true })
  },
  getUserList(params) {
    return request({ url: '/users/list', method: 'get', data: params, mock: false })
  },
  delUsers(params) {
    return request({ url: '/users/delete', method: 'post', data: params, mock: false })
  },
  getAllRole(params) {
    return request({ url: '/roles/allList', method: 'get', data: params, mock: true })
  },
  getAllDept(params) {
    return request({ url: '/dept/list', method: 'get', data: params, mock: true })
  },
  userSubmit(params) {
    return request({ url: '/users/operate', method: 'post', data: params, mock: true })
  },
}
