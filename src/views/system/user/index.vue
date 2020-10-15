<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small">
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
    <el-table ref="table" v-loading="showLoading" :data="data" size="small" highlight-current-row class="table-container">
      <el-table-column label="用户名" resizable prop="username" />
      <el-table-column label="昵称" prop="nickName" />
      <el-table-column label="手机" prop="phone" />
      <el-table-column label="注册日期" prop="dateCreated" />
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
import { list } from '@/api/system/user'
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
      list(this.qo).then(res => {
        this.data = res.rows
        this.total = res.total
        this.showLoading = false
      })
    },
    create() {
      this.$refs.form.createOpen()
    },
    update(row) {
      this.$refs.form.updateOpen(row.id)
    }
  }
}
</script>
