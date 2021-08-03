import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Login from '../components/Login'

const routes = [{
    name: 'home',
    path: '/',
    component: Home,
    mate: {
        title: '首页'
    },
    redirect: '/welcome',
    children: [{
        name: 'welcome',
        path: '/welcome',
        mate: {
            title: '欢迎页'
        },
        component: Welcome,
    }, {
        name: 'login',
        path: '/login',
        mate: {
            title: '登录'
        },
        component: Login,
    }]
}]

const router = createRouter({
    history: createWebHashHistory,
    routes
})

export default router