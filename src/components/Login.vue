<template>
  <h1>欢迎来到登录界面</h1>
  <el-button @click="goHome">回首页</el-button>
</template>

<script>
export default {
  data(){
    return {
    }
  },
  mounted() {
    // this.$request({
    //   method: 'get',
    //   url: '/login',
    //   data: {
    //     name: '刘亚',
    //     pass: '111111'
    //   }
    // }).then(res => {
    //   console.log(res, '登录结果')
    // })
    this.$request.get('/login', {name: '刘亚', pass: '111111'}, {mock: true, loading: true}).then(res => {
      console.log(res, '登录结果')
    })
  },
  methods:{
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
</style>