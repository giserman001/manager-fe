<template>
    <template v-for="menu in userMenu">
        <el-submenu v-if="menu.children && menu.children.length && menu.children[0].menuType == 1" :key="menu._id" :index="menu.path">
            <template #title>
                <i :class="menu.icon"></i>
                <span>{{menu.menuName}}</span>
            </template>
            <tree-menu :userMenu="menu.children" />
        </el-submenu>
        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">
            <!-- <i class="el-icon-menu"></i>
            <template #title>导航二</template> -->
            {{menu.menuName}}
        </el-menu-item>
    </template>
</template>

<script>
export default {
  name: 'TreeMenu',
  props: {
      userMenu: {
        type: Array,
        default() {
            return []
        }
      }
  },
  data(){
    return {
    }
  },
  methods:{},
}
</script>
<style scoped>
</style>