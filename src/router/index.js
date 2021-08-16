import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'

const routes = [{
    name: 'home',
    path: '/',
    component: Home,
    meta: {
      title: '首页',
    },
    redirect: '/welcome',
    children: [{
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页',
        },
        component: () => import('@/views/home/Welcome.vue'),
      }, {
        name: 'User',
        path: '/system/user',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/account/User.vue'),
      }, {
        name: 'Menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理',
        },
        component: () => import('@/views/account/Menu.vue'),
      }]
  }, {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/login/Login.vue'),
  }]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
