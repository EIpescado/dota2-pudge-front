<template>
  <div class="app-container">
    <el-row :gutter="15">
      <!--角色列表-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <!--卡片头-->
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <!--查询-->
          <div ref="filterContainer" class="filter-container">
            <el-form ref="qo" :inline="true" :model="qo">
              <el-form-item label="角色" prop="name">
                <el-input v-model.trim="qo.name" clearable />
              </el-form-item>
              <!--查询框按钮-->
              <FilterButton :baba="this" />
            </el-form>
          </div>
          <!-- 顶部按钮 -->
          <TopButton :baba="this" />
          <!--table右侧工具按钮-->
          <TableRightButton :baba="this" />
          <!--列表-->
          <el-table ref="table" v-loading="showLoading" :data="dataList" highlight-current-row class="table-container" @row-click="handleRowClick">
            <el-table-column label="角色名" prop="name" />
            <el-table-column label="等级" prop="level" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="创建日期" prop="dateCreated" />
            <el-table-column label="修改日期" prop="lastUpdated" />
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <!-- 右侧按钮 -->
                <SingleRowButton :baba="scope" />
              </template>
            </el-table-column>
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
            <!-- 顶部按钮 -->
            <TopButton :baba="this" position="TOP_RIGHT" size="mini" style="float: right; width: 100px; padding: 0 9px;" />
          </div>
          <el-tree
            ref="menu"
            v-loading="roleTreeLoading"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            default-expand-all
            check-on-click-node
            :check-strictly="true"
            node-key="id"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <svg-icon :icon-class="data.icon" />
              <span class="custom-tree-lable">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <Form ref="roleForm" :baba="this" />
  </div>
</template>

<script>
import { list, deleteRole, singleRoleMenuAndButton, bindMenuAndButton } from '@/api/system/role'
import { wholeTree } from '@/api/system/menu'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import TableRightButton from '@/components/TableRightButton'
import FilterButton from '@/components/FilterButton'
import SingleRowButton from '@/components/SingleRowButton'
import Form from './form'
export default {
  name: 'Role',
  components: { Pagination, TopButton, Form, TableRightButton, FilterButton, SingleRowButton },
  data() {
    return {
      dataList: null, total: 0, showLoading: false,
      qo: { page: 1, size: 10 },
      menus: [], menuIds: [], currentRoleId: '', roleTreeLoading: false,
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
        this.dataList = response.rows
        this.total = response.total
        this.showLoading = false
      })
    },
    create() {
      this.$refs.roleForm.createOpen()
    },
    update(row) {
      this.$refs.roleForm.updateOpen(row.id)
    },
    handleDelete(row) {
      this.$confirm('确认删除此角色?', '提示', {
        type: 'warning'
      }).then(() => {
        const ld = this.$loading()
        deleteRole(row.id).then(res => {
          this.$message.success('删除成功')
          ld.close()
          this.getData()
        })
      }).catch(() => {})
    },
    bindRelation() {
      if (!this.currentRoleId) {
        this.$message.error('请先选择角色')
      } else {
        const ld = this.$loading()
        const nodes = this.$refs.menu.getCheckedNodes()
        const params = []
        nodes.forEach(function(data, index) {
          params.push({
            id: data.id,
            whetherButton: data.whetherButton
          })
        })
        setTimeout(() => {
          bindMenuAndButton(this.currentRoleId, params).then(res => {
            this.$message({
              message: '绑定成功',
              type: 'success'
            })
            ld.close()
          }).catch(err => {
            ld.close()
            console.log(err)
          })
        }, 600)
      }
    },
    wholeTree() {
      this.roleTreeLoading = true
      wholeTree().then(response => {
        this.menus = response
        this.roleTreeLoading = false
      })
    },
    handleRowClick(row, column, event) {
      this.roleTreeLoading = true
      this.currentRoleId = row.id
      // 清空选中
      this.$refs.menu.setCheckedKeys([])
      // 点击后显示按钮
      this.showButton = true
      singleRoleMenuAndButton(row.id).then(response => {
        this.menuIds = response
        this.roleTreeLoading = false
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.role-span {
  font-weight: bold;color: #303133;
  font-size: 15px;
}
.filter-tree{
  margin-top:16px;
}
.custom-tree-node {
  flex: 1;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .custom-tree-lable {
    margin-left: 8px;
  }
}
</style>
