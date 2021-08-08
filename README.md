### 笔记

1. vite开发时组件引入地址必须带后缀.vue

//正确
import XX from './xx.vue'
//错误
import XX from './xx'

2. vite可以配置别名, 解决相对路径问题，类似于webpack里面里面@
resolve: {
    alias: {
        '@': path.resolve(__dirname, './src')
    }
}

3. 全局的minxin样式问题，可以通过vite进行配置

css: {
    preprocessorOptions: {
        scss: {
            additionalData: `@import '@/assets/style/base.scss';`
        }
    }
}

// 提问： 这个与全局样式有啥区别? 这种做法主要是为了类似scss/less这种可以声明变量和函数的，那么我们可以通过minxin方式引入全局。