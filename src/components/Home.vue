<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        class="nav-menu"
        default-active="2"
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
        router
        @open="handleOpen"
        @close="handleClose">
          <userMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle"><i :class="['el-icon-s-fold', 'fold-icon', isCollapse ? 'fold-rotate' : 'un-fold-rotate']"></i></div>
          <div class="bread">
            <Breadcrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="!!noticeCount" class="notice" type="danger">
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <span class="user-link">
              {{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{userInfo.userEmail}}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view ></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import userMenu from './TreeMenu.vue'
import Breadcrumb from './Breadcrumb.vue'
export default {
  name: 'Home',
  components: {
    userMenu,
    Breadcrumb
  },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo || {
        userName: 'Jack',
        userEmail: '1522962872@qq.com'
      },
      noticeCount: 0,
      userMenu: []
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(key) {
      if(key === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = {}
      this.$router.push('/login')
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    async getNoticeCount() {
      try {
        const res = await this.$api.noticeCount()
        this.noticeCount = res
      } catch (error) {
        console.log(error)
      }
    },
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList()
        this.userMenu = list
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    transition: margin-left 0.5s;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
          cursor: pointer;
          .fold-icon{
            transition: transform 0.5;
            &.fold-rotate{
              transform: rotate(180deg);
            }
            &.un-fold-rotate{
              transform: rotate(0deg);
            }
          }
          
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>
