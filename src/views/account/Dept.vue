<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :model="queryForm" inline ref="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="primary" @click="handleReset('queryForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          v-bind="item"
        >
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template v-slot:default="{ row }">
            <el-button @click="handleEdit(row)" type="primary" size="mini"
              >编辑</el-button
            >
            <el-button @click="delFn(row._id)" type="danger" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action === 'create' ? '创建部门' : '编辑部门'"
      v-model="showModal"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            :options="deptList"
            show-all-levels
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            placeholder="请选择上级部门"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            v-model="deptForm.user"
            placeholder="请选择负责人"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            v-model="deptForm.userEmail"
            placeholder="请输入负责人邮箱"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        deptName: '',
      },
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      deptList: [],
      columns: [
        {
          label: '部门名称',
          prop: 'deptName',
        },
        {
          label: '负责人',
          prop: 'userName',
        },
        {
          label: '更新时间',
          prop: 'updateTime',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
      ],
      action: '',
      showModal: false,
      deptForm: {
        parentId: [null]
      },
      rules: {
        parentId: [
          { required: true, message: '请选择上级部门', trigger: 'blur' },
        ],
        deptName: [
          { required: true, message: '请选择部门名称', trigger: 'blur' },
        ],
        user: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
      },
      userList: [],
    }
  },
  mounted() {
    this.handleQuery()
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const list = await this.$api.getUserAllList()
      console.log(list)
      this.userList = list
    },
    // 部门列表
    async getDeptList() {
      this.deptList = await this.$api.getAllDept(this.queryForm)
    },
    // 表单提交
    handleQuery() {
      this.getDeptList()
    },
    // 表单取消
    handleClose() {
      this.showModal = false
      this.handleReset('dialogForm')
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const { deptForm, action } = this
          const params = { ...deptForm, action }
          delete params.user
          try {
            await this.$api.deptSubmit(params)
            this.$message.success('操作成功')
            this.handleReset('dialogForm')
            this.showModal = false
          } catch (error) {
            throw new Error(error)
          }
        }
      })
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields()
      this.getDeptList()
    },
    handleOpen() {
      this.action = 'create'
      this.showModal = true
    },
    handleEdit(row) {
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {
        this.deptForm = {
          ...this.deptForm,
          parentId: row.parentId,
          userId: row.userId,
          userEmail: row.userEmail,
          deptName: row.deptName,
          user: `${row.userId}/${row.userName}/${row.userEmail}`,
        }
      })
    },
    async delFn(_id) {
      await this.$api.deptSubmit({ _id, action: 'delete' })
      this.$message.success('删除成功')
      this.getDeptList()
    },
    handleUser(val) {
      const [userId, userName, userEmail] = val.split('/')
      this.deptForm = { ...this.deptForm, ...{ userId, userName, userEmail } }
    },
  },
}
</script>

<style>
</style>