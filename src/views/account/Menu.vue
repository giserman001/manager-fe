<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form ref="queryForm" :model="queryForm" inline>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <!-- <el-form-item label="用户名称" prop="menuState">
          <el-input v-model="queryForm.menuState" placeholder="请输入用户名称" />
        </el-form-item> -->
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
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
        <el-button type="primary" @click="handleClickAdd(1)">新增</el-button>
      </div>
      <el-table :data="menuList" row-key="_id" :tree-props="{children: 'children'}">
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template v-slot:default="{ row }">
            <el-button @click="handleClickAdd(2, row)" type="primary" size="mini">新增</el-button>
            <el-button @click="handleEdit(row)" size="mini">编辑</el-button>
            <el-button @click="delFn(row._id)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增用户" v-model="showModal">
      <el-form ref="dialogForm" :model="menuForm" label-width="100px" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            show-all-levels
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            placeholder="请选择父级菜单"
            clearable
          />
          <span class="ml20">不选，直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType === '1'">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-if="menuForm.menuType === '1'">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-if="menuForm.menuType === '2'">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="menuForm.menuType === '1'">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-if="menuForm.menuType === '1'">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio label="1">正常</el-radio>
            <el-radio label="2">停用</el-radio>
          </el-radio-group>
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
import util from '@/utils/util'
export default {
  name: 'Menu',
  data() {
    return {
      queryForm: {
        menuState: 1
      },
      menuList: [],
      columns: [{
        label: '菜单名称',
        prop: 'menuName',
        width: 180
      }, {
        label: '菜单图标',
        prop: 'icon'
      }, {
        label: '菜单类型',
        prop: 'menuType',
        formatter(row, column, value) {
          return {
            '1': '菜单',
            '2': '按钮'
          }[value]
        }
      }, {
        label: '权限标识',
        prop: 'menuCode',
      }, {
        label: '路由地址',
        prop: 'path',
      }, {
        label: '组件路径',
        prop: 'component',
      }, {
        label: '菜单状态',
        prop: 'menuState',
        width: 90,
        formatter(row, column, value) {
          return {
            '1': '正常',
            '2': '停用'
          }[value]
        }
      }, {
        label: '创建时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return util.formateDate(value)
        }
      }],
      showModal: false,
      rules: {
        menuName: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在2-8之间', trigger: 'blur'}
        ]
      },
      action: 'add',
      menuForm: {
        parentId: [null],
        menuType: '1',
        menuState: '1'
      }
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    // 菜单列表
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList(this.queryForm)
        this.menuList = list
      } catch (error) {
        throw new Error(error)
      }
    },
    handleQuery() {
      this.getMenuList()
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields()
      this.getMenuList()
    },
    handleClickAdd(type, row) {
      this.showModal = true
      this.action = 'add'
      if(type === 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(item => item)
      }
    },
    handleEdit(row) {
      this.showModal = true
      this.action = 'edit'
      this.$nextTick(() => {
        this.menuForm = row
      })
    },
    async delFn(id) {
      await this.$api.menuSubmit({_id: id, action: 'delete'})
      this.$message.success('删除成功')
      this.getMenuList()
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async(valid) => {
        if(valid) {
          const { action }  = this
          const params = {...this.menuForm, action}
          try {
            await this.$api.menuSubmit(params)
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
    }
  }
}
</script>

<style></style> 
