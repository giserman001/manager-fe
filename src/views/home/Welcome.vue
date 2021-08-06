<template>
  <div class="welcome">
    <h1>欢迎来到主界面</h1>
    <router-link to="/login">去登录</router-link>
  </div>
</template>

<script>
export default {
  data(){
    return {
    }
  },
  mounted(){
    // this.$storage.setItem('name', '刘亚')
    // this.$storage.setItem('age', 18)
    // this.$storage.setItem('obj', {name: '11', age: 14})
    // console.log(this.$storage.getItem('obj'), 'mmmmmm')
    // this.$storage.clearItem('age')
    // this.$storage.clearAll()
  }
}
</script>
<style scoped>
</style>