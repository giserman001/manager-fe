<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form ref="queryForm" :model="user" inline>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="primary" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
          <el-button type="primary">新增</el-button>
          <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column label="操作" width="160">
            <template v-slot:default="{ row }">
                <el-button @click="handleClick(row)" size="mini">编辑</el-button>
                <el-button @click="delFn(row)" type="danger" size="mini">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pages.total"
        :page-size="pages.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// composition api去写项目
import { reactive, onMounted, ref, getCurrentInstance } from 'vue'
export default {
  name: 'User',
  setup() {
    // 获取composition api 上下文对象
    const instance = getCurrentInstance()
    const user = reactive({
      userId: '',
      userName: '',
      state: 1
    })
    const userList = ref([])
    const pages = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId',
      },
      {
        label: '用户名称',
        prop: 'userName',
      },
      {
        label: '用户邮箱',
        prop: 'userEmail',
      },
      {
        label: '用户角色',
        prop: 'role',
      },
      {
        label: '用户状态',
        prop: 'state',
      },
      {
        label: '注册时间',
        prop: 'createTime',
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
      },
    ])
    onMounted(() => {
      getUserList()
    })
    const getUserList = async() => {
      try {
        const params = {...user, ...pages}
        const { list, page } = await instance.proxy.$api.getUserList(params)
        console.log(list, page, 'ddddddddddddddd')
        userList.value = list
        pages.total = page.total
      } catch (error) {
        console.log(error)
      }
    }
    const handleClick = () => {}
    const delFn = () => {}
    // 查询
    const handleQuery = () => {
      getUserList()
    }
    // 重置
    const handleReset = () => {
      instance.proxy.$refs.queryForm.resetFields()
      getUserList()
    }
    // 分页事件处理
    const handleCurrentChange = (current) => {
      pages.pageNum = current
      getUserList()
    }
    return {
      user,
      userList,
      columns,
      handleClick,
      delFn,
      getUserList,
      pages,
      handleReset,
      handleQuery,
      handleCurrentChange
    }
  },
}
</script>

<style></style>
