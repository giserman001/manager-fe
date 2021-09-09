import { createRouter, createWebHashHistory } from 'vue-router'
import stroage from '@/utils/storage'
import API from '@/api'
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
      }, {
        name: 'Role',
        path: '/system/role',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/views/account/role.vue'),
      }, {
        name: 'Dept',
        path: '/system/dept',
        meta: {
          title: '部门管理',
        },
        component: () => import('@/views/account/Dept.vue'),
      }]
  }, {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
    },
    component: () => import('@/views/login/Login.vue'),
  }, {
    name: '404',
    path: '/404',
    meta: {
      title: '页面不存在',
    },
    component: () => import('@/views/404.vue'),
  }]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
// 判断当前地址是否可以访问
function checkPermission(path) {
  let hasPermission = router.getRoutes().filter(route => route.path === path).length
  return !!hasPermission
}
// 路由导航守卫
// router.beforeEach((to, form, next) => {
//   if(checkPermission(to.path)) {
//     document.title = to.meta.title
//     next()
//   } else {
//     next('/404')
//   }
// })
// 实时获取路由权限
async function loadAsyncRoutes() {
  // let userInfo = stroage.getItem('userInfo') || {}
  // if(userInfo.token) {
  //   const { menuList } = await API.getPermissionList()
  //   const routes = generateRoute(menuList)
  //   routes.forEach(route => {
  //     // 动态添加
  //     route.component = () => import()
  //     router.addRoute(route)
  //   })
  // }
}
// 生成路由
function generateRoute(menuList) {
  let routes = []
  const deep = (arr) => {
    arr.forEach(item => {
      if (item.action) {
        item.action.forEach(list => {
          routes.push({
            name: item.path.split('/').join(''),
            path: item.path,
            meta: {
              title: item.menuName,
            },
            component: item.component,
          })
        })
      }
      if(item.children && !item.action) {
        deep(item.children);
      }
    })
  };
  deep(menuList);
  return routes
}
await loadAsyncRoutes()
// router.addRoute()

export default router
