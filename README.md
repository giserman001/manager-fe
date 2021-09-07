# 学习进度

404 页面开发

### 笔记

1. vite 开发时组件引入地址必须带后缀.vue

//正确
import XX from './xx.vue'
//错误
import XX from './xx'

2. vite 可以配置别名, 解决相对路径问题，类似于 webpack 里面里面@
   resolve: {
   alias: {
   '@': path.resolve(\_\_dirname, './src')
   }
   }

3. 全局的 minxin 样式问题，可以通过 vite 进行配置

css: {
preprocessorOptions: {
scss: {
additionalData: `@import '@/assets/style/base.scss';`
}
}
}

// 提问： 这个与全局样式有啥区别? 这种做法主要是为了类似 scss/less 这种可以声明变量和函数的，那么我们可以通过 minxin 方式引入全局。这样就可以在页面使用全局定义的变量和函数了
