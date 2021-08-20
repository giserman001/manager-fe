<template>
  <div class="role-manager">
    <div class="query-form">
      <el-form ref="queryForm" :model="queryForm" inline>
        <el-form-item label="角色名称" prop="menuName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="primary" @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleClickAdd()">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template v-slot:default="{ row }">
            <el-button @click="handleEdit(row)" type="primary" size="mini">编辑</el-button>
            <el-button @click="setPower(row)" type="primary" size="mini">设置权限</el-button>
            <el-button @click="delFn(row._id)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="pages.total"
        :page-size="pages.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="创建角色" v-model="showModal">
      <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="roleForm.remark" type="textarea" :rows="4" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 权限弹框 -->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form ref="dialogForm">
        <el-form-item label="角色名称">{{curRoleName}}</el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permisstionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }">
          </el-tree>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="showPermission = false">取 消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      menuList: [],
      pages: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      queryForm: {
        roleName: ''
      },
      columns: [{
        label: '角色名称',
        prop: 'roleName',
      }, {
        label: '权限列表',
        prop: 'permissionList',
        formatter:(row, column, value) => {
          let list = value.halfCheckedKeys || []
          return list.map(key => this.actionMap[key]).filter(item => item).join(', ')
        }
      }, {
        label: '创建时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return util.formateDate(value)
        }
      }, {
        label: '备注',
        prop: 'remark'
      }],
      showModal: false,
      roleForm: {},
      rules: {
        roleName: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ]
      },
      action: 'create',
      showPermission: false,
      curRoleId: '',
      curRoleName: '',
      // 菜单映射表
      actionMap: {}
    }
  },
  mounted() {
    this.getRoleList()
    this.getMenuList()
  },
  methods: {
    // 菜单列表
    async getMenuList() {
      const list = await this.$api.getMenuList()
      this.menuList = list
      this.getActionMap(JSON.parse(JSON.stringify(list)))
    },
    getActionMap(list) {
      let actionMap = {}
      const deep = (arr) => {
        while(arr.length) {
          let item = arr.pop()
          if(item.children && item.action) {
            actionMap[item._id] = item.menuName
          }
          if(item.children && !item.action) {
            deep(item.children)
          }
        }
      }
      deep(list)
      this.actionMap = actionMap
    },
    // 角色列表
    async getRoleList() {
      const res = await this.$api.getRoleList({...this.queryForm, ...this.pages})
      this.roleList = res.list
      this.pages.total = res.page.total
    },
    handleQuery() {
      this.getRoleList()
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields()
      this.getRoleList()
    },
    handleClickAdd() {
      this.showModal = true
      this.action = 'create'
    },
    handleEdit(row) {
      this.showModal = true
      this.action = 'edit'
      this.$nextTick(() => {
        this.roleForm = {
          ...this.roleForm,
          _id: row._id,
          roleName: row.roleName,
          remark: row.remark
        }
      })
    },
    async delFn(id) {
      await this.$api.roleSubmit({_id: id, action: 'delete'})
      this.$message.success('删除成功')
      this.getRoleList()
    },
    // 设置权限
    setPower(row) {
      this.showPermission = true
      this.curRoleName = row.roleName
      this.curRoleId = row._id
      let { checkedKeys } = row.permissionList
      this.$nextTick(() => {
        this.$refs.permisstionTree.setCheckedKeys(checkedKeys)
      })
    },
    handleCurrentChange(current) {
      this.pages.pageNum = current
      this.getRoleList()
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async(valid) => {
        if(valid) {
          const { roleForm, action }  = this
          const params = {...roleForm, action}
          try {
            await this.$api.roleSubmit(params)
            this.showModal = false
            this.$message.success('操作成功')
            this.handleReset('dialogForm')
          } catch (error) {
            throw new Error(error)
          }
        }
      })
    },
    handleClose() {
      this.showModal = false
      this.handleReset('dialogForm')
    },
    async handlePermissionSubmit() {
      const checkNodes = this.$refs.permisstionTree.getCheckedNodes()
      // const checkNodesKeys = this.$refs.permisstionTree.getCheckedKeys()
      // console.log('checkNodes=>', checkNodes) // 获取tree整个节点
      // console.log('checkNodesKeys=>', checkNodesKeys) // 获取node-key设置的值
      const halfCheckNodes = this.$refs.permisstionTree.getHalfCheckedKeys()
      const parseCheckNodes = checkNodes.filter(item => !item.children).map(list => list._id)
      const parseParentCheckNodes = checkNodes.filter(item => item.children).map(list => list._id)
      await this.$api.setRolePermission({_id: this.curRoleId, permissionList: {
        checkedKeys: parseCheckNodes,
        halfCheckedKeys: [...parseParentCheckNodes, ...halfCheckNodes]
      }})
      this.showPermission = false
      this.$message.success('权限设置成功')
      this.getRoleList()
    }
  }
}
</script>

<style></style> 
