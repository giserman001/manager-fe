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
  methods:{
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
</style>