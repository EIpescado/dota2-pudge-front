<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="qo.username" clearable />
        </el-form-item>
      </el-form>
      <!--查询框按钮-->
      <FilterButton :baba="this" />
    </div>

    <!--顶部按钮-->
    <TopButton :baba="this" />

    <!--table右侧工具按钮-->
    <TableRightButton :baba="this" />

    <!--列表-->
    <el-table ref="table" v-loading="showLoading" :data="data" highlight-current-row class="table-container">
      <el-table-column label="用户名" resizable prop="username" />
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="手机" prop="phone" />
      <el-table-column label="邮箱" prop="mail" />
      <el-table-column label="注册日期" prop="dateCreated" />
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <el-tag effect="dark" :type="row.enabled ? 'success' : 'danger'">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <!-- 右侧按钮 -->
          <SingleRowButton :baba="scope" />
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <Pagination :total="total" :page.sync="qo.page" :limit.sync="qo.size" @pagination="getData" />

    <Form ref="form" />
  </div>
</template>

<script>
import { list, resetPassword, switchEnabled } from '@/api/system/user'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import SingleRowButton from '@/components/SingleRowButton'
import TableRightButton from '@/components/TableRightButton'
import FilterButton from '@/components/FilterButton'
import Form from './form'
export default {
  name: 'User',
  components: { Pagination, TopButton, TableRightButton, FilterButton, Form, SingleRowButton },
  data() {
    return {
      showLoading: false, data: null, total: 0,
      qo: { page: 1, size: 10, username: '' }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.showLoading = true
      setTimeout(() => {
        list(this.qo).then(res => {
          this.data = res.rows
          this.total = res.total
          this.showLoading = false
        })
      }, 400)
    },
    create() {
      this.$refs.form.createOpen()
    },
    update(row) {
      this.$refs.form.updateOpen(row.id)
    },
    resetPassword(row) {
      this.$confirm('确认重置用户 ' + row.username + ' 密码', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        const ld = this.$loading()
        setTimeout(() => {
          resetPassword(row.id).then(res => {
            this.$message.success('重置成功')
            ld.close()
          }).catch(() => {
            ld.close()
          })
        }, 400)
      }).catch(() => {})
    },
    switchEnabled(row) {
      const tip = row.enabled ? '禁用' : '启用'
      this.$confirm('确认' + tip + '用户 ' + row.username, '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        const ld = this.$loading()
        setTimeout(() => {
          switchEnabled(row.id).then(res => {
            this.$message.success('用户 ' + row.username + ' 已' + tip)
            ld.close()
            this.getData()
          }).catch(() => { ld.close() })
        }, 400)
      }).catch(() => {})
    }
  }
}
</script>
