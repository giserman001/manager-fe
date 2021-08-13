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
          <el-button type="primary" @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleClickAdd">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template v-slot:default="{ row }">
            <el-button @click="handleEdit(row)" size="mini">编辑</el-button>
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
    <el-dialog title="新增用户" v-model="showModal">
      <el-form ref="dialogForm" :model="userForm" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action === 'edit'"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action === 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template v-slot:append>@imooc.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="在离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择对应角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :value="role._id"
              :label="role.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            :options="deptList"
            show-all-levels
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            placeholder="请选择所属部门"
            style="width: 100%"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// composition api去写项目
import { reactive, onMounted, ref, getCurrentInstance, toRaw, nextTick } from 'vue'
import util from '@/utils/util'
export default {
  name: 'User',
  setup() {
    // 获取composition api 上下文对象
    const { proxy } = getCurrentInstance()
    const user = reactive({
      userId: '',
      userName: '',
      state: 1,
    })
    const showModal = ref(false)
    const userForm = reactive({
      userName: '',
      userEmail: '',
      mobile: '',
      state: 3,
      deptId: '',
      job: '',
      roleList: '',
    })
    // 所有角色列表
    const roleList = ref([])
    // 所有部门数据
    const deptList = ref([])
    // 定义用户操作的行为
    let action = ref('add')
    const rules = reactive({
      userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
      userEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
      mobile: [{ pattern: /1[3-9]\d{9}/, message: '请输入正确手机号格式', trigger: 'blur' }],
      roleList: [{ required: true, message: '请选择角色', trigger: 'blur' }],
      deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
    })
    const userList = ref([])
    const pages = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
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
        label: '岗位',
        prop: 'job',
      },
      {
        label: '用户邮箱',
        prop: 'userEmail',
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(row, column, value) {
          return {
            0: '系统管理员',
            1: '普通用户',
          }[value]
        },
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, value) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期',
          }[value]
        },
      },
      {
        label: '注册时间',
        prop: 'createTime',
        width: 180,
        formatter(row, column, value) {
          return util.formateDate(value)
        },
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        width: 180,
        formatter(row, column, value) {
          return util.formateDate(value)
        },
      },
    ])
    // 选中用户列表的对象
    const checkUsersIds = ref([])
    onMounted(() => {
      getUserList()
      getRoleList()
      getDeptList()
    })
    const getUserList = async () => {
      try {
        const params = { ...user, ...pages }
        const { list, page } = await proxy.$api.getUserList(params)
        userList.value = list
        pages.total = page.total
      } catch (error) {
        console.log(error)
      }
    }
    // 用户编辑
    const handleEdit = (row) => {
      showModal.value = true
      action.value = 'edit'
      // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象
      // 这里有个坑，无法通过element from重置表单了(细究原因。),解决办法就是用nextTick
      // proxy.$nextTick(() => {})
      nextTick(() => {
        Object.assign(userForm, row)
      })
    }
    // 单个删除
    const delFn = async (row) => {
      await proxy.$api.delUsers({ userIds: [row.userId] })
      proxy.$message.success('删除成功')
      getUserList()
    }
    // 查询
    const handleQuery = () => {
      getUserList()
    }
    // 重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
      getUserList()
    }
    // 分页事件处理
    const handleCurrentChange = (current) => {
      pages.pageNum = current
      getUserList()
    }
    // 批量删除
    const handlePatchDel = async () => {
      if (!checkUsersIds.value.length) {
        proxy.$message.error('请选择要删除的用户')
        return
      }
      const res = await proxy.$api.delUsers({ userIds: checkUsersIds.value })
      if (res.nModified > 0) {
        proxy.$message.success('删除成功')
        getUserList()
      } else {
        proxy.$message.error('删除失败')
      }
    }
    // 表格多选
    const handleSelectionChange = (list) => {
      checkUsersIds.value = list.map((item) => item.userId)
    }
    // 用户新增
    const handleClickAdd = () => {
      action.value = 'add'
      showModal.value = true
    }
    // 获取角色列表
    const getRoleList = async () => {
      const list = await proxy.$api.getAllRole()
      roleList.value = list
    }
    // 获取部门列表
    const getDeptList = async () => {
      const list = await proxy.$api.getAllDept()
      deptList.value = list
    }
    // 用户新增取消
    const handleCancel = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    // 用户新增提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        // 我们就可以通过toRaw方法拿到它的原始数据, 对原始数据进行修改,这样就不会被追踪, 这样就不会更新UI界面, 这样性能就好了
        // 换句话说：响应式对象转化成普通对象 (目标： 提高性能)
        if (valid) {
          showModal.value = false
          const params = toRaw(userForm)
          params.userEmail += '@imooc.com'
          params.action = action.value
          await proxy.$api.userSubmit(params)
          proxy.$message.success('提交成功')
          // 重置表单
          handleReset('dialogForm')
          // 刷新用户列表数据
          getUserList()
        }
      })
    }
    return {
      user,
      showModal,
      userForm,
      rules,
      userList,
      columns,
      checkUsersIds,
      handleEdit,
      delFn,
      getUserList,
      pages,
      handleReset,
      handleQuery,
      handleCurrentChange,
      handlePatchDel,
      handleSelectionChange,
      handleClickAdd,
      roleList,
      deptList,
      handleCancel,
      handleSubmit,
      action
    }
  },
}
</script>

<style></style>
