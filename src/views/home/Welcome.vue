<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">慕课通用后台管理系统</div>
      <div class="desc">-Vue3.0+ElementPlus+Node+Mongodb打造通用后台管理系统</div>
    </div>
    <div class="img"></div>
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
<style lang="scss" scoped>
.welcome{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #fff;
  .content{
    position: relative;
    bottom: 40px;
    .sub-title{
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title{
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc{
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }
  .img{
    margin-left: 105px;
    background-image: url('./../../src/assets/images/welcome.png');
    width: 371px;
    height: 438px;
  }
}
</style>