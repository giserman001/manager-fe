<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script>
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default {
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  name: 'App',
  data() {
    return {
      locale: zhCn,
    }
  }
}
</script>

<style lang="scss">
@import './assets/style/reset.css';
@import './assets/style/index.scss';
</style>
