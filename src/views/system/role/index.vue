<template>
  <div class="app-container">
    <el-row :gutter="15">
      <!--角色列表-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <!--卡片头-->
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
            <div id="opt" style="float: right" />
          </div>
          <!--查询-->
          <div ref="filterContainer" class="filter-container">
            <el-form ref="qo" :inline="true" :model="qo" size="small">
              <el-form-item label="角色" prop="name">
                <el-input v-model.trim="qo.name" clearable />
              </el-form-item>
              <!--查询框按钮-->
              <FilterButton :baba="this" />
            </el-form>
          </div>
          <!-- 顶部按钮 -->
          <TopButton />
          <!--table右侧工具按钮-->
          <TableRightButton :baba="this" />
          <!--列表-->
          <el-table ref="table" v-loading="showLoading" :data="data" size="small" highlight-current-row class="table-container" @row-click="handleRowClick">
            <el-table-column label="角色名" prop="name" />
            <el-table-column label="等级" prop="level" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="创建日期" prop="dateCreated" />
          </el-table>

          <!--分页插件-->
          <pagination :total="total" :page.sync="qo.page" :limit.sync="qo.size" @pagination="getData" />
        </el-card>
      </el-col>

      <!--菜单及按钮权限-->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单及按钮" placement="top">
              <span class="role-span">菜单及按钮分配</span>
            </el-tooltip>
            <el-button :disabled="!showButton" :loading="menuLoading" icon="el-icon-check" size="mini" style="float: right; padding: 6px 9px" type="primary" @click="bindRelation">
              保存
            </el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            default-expand-all
            :check-strictly="treeSetTrue"
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>

    <Form ref="roleForm" />
  </div>
</template>

<script>
import { list, deleteRole, singleRoleMenuAndButton, bindMenuAndButton } from '@/api/system/role'
import { wholeTree } from '@/api/system/menu'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import TableRightButton from '@/components/TableRightButton'
import FilterButton from '@/components/FilterButton'
import Form from './form'
export default {
  name: 'Role',
  components: { Pagination, TopButton, Form, TableRightButton, FilterButton },
  data() {
    return {
      data: null, total: 0, showLoading: false,
      qo: { page: 1, size: 10 },
      menuLoading: false, showButton: false, treeSetTrue: true,
      menus: [], menuIds: [], currentRoleId: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getData()
    this.wholeTree()
  },
  methods: {
    getData() {
      this.showLoading = true
      list(this.qo).then(response => {
        this.data = response.rows
        this.total = response.total
        this.showLoading = false
      }).catch(() => {
        this.showLoading = false
      })
    },
    create() {
      this.$refs.roleForm.createOpen()
    },
    update() {
      if (this.currentRoleId) {
        this.$refs.roleForm.updateOpen(this.currentRoleId)
      } else {
        this.$message.error({
          message: '请选择一个角色'
        })
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除此角色?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
      }).catch(() => {})
    },
    bindRelation() {
      const nodes = this.$refs.menu.getCheckedNodes()
      const params = []
      nodes.forEach(function(data, index) {
        params.push({
          id: data.id,
          whetherButton: data.whetherButton
        })
      })
      bindMenuAndButton(this.currentRoleId, params).then(res => {
        this.$message({
          message: '绑定成功',
          type: 'success'
        })
        this.menuLoading = false
      }).catch(err => {
        this.menuLoading = false
        console.log(err)
      })
    },
    wholeTree() {
      wholeTree().then(response => {
        this.menus = response
      })
    },
    handleRowClick(row, column, event) {
      this.currentRoleId = row.id
      // 清空选中
      this.$refs.menu.setCheckedKeys([])
      // 点击后显示按钮
      this.showButton = true
      singleRoleMenuAndButton(row.id).then(response => {
        this.menuIds = response
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>
