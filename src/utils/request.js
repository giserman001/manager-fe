/**
 * axios二次封装
 *
 */

import axios from 'axios'
import config from '@/config'
import { ElMessage } from 'element-plus'
import router from '@/router'
import storage from '@/utils/storage'
const TOKEN_INVALID = 'Token认证失败, 请重新登录'
const NETWORK_ERROR = '网络请求异常, 请稍后重试'

// 创建axios实力对象, 添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
})

// 请求拦截
service.interceptors.request.use((req) => {
  const headers = req.headers
  const { token } = storage.getItem('userInfo') || ''
  if (!headers.Authorization && token) headers.Authorization = 'Bearer ' + token
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      // 跳转到登录页
      router.push('/login')
    }, 1500)
    // 控制台抛出异常
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})
/**
 * 请求核心函数
 * @param {*} options 请求配置
 */
function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  // 局部接口mock
  if (typeof options.mock != 'undefined') {
    config.mock = options.mock
  }
  // 以防万一，确保万无一失
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  return service(options)
}

;['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      method: item,
      url,
      data,
      ...options,
    })
  }
})

export default request
