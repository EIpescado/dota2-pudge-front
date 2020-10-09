<template>
  <div class="app-container">

    <!--查询-->
    <div v-if="showFilterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo" size="small">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="qo.username" @keyup.enter.native="search" />
        </el-form-item>
        <div class="filter-button-container">
          <el-button type="primary" size="small" icon="el-icon-search" round @click="search">
            搜索
          </el-button>
          <el-button size="small" icon="el-icon-refresh" round @click="refreshQo">
            重置
          </el-button>
        </div>
      </el-form>
    </div>

    <!--顶部按钮-->
    <TopButton />

    <!--table右侧工具按钮-->
    <TableRightButton />

    <!--列表-->
    <el-table ref="table" v-loading="showLoading" :data="data" size="small" highlight-current-row class="table-container">
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="昵称" prop="nickName" />
      <el-table-column label="手机" prop="phone" />
      <el-table-column label="注册日期" prop="dateCreated" />
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="getData" />

  </div>
</template>

<script>
import { list } from '@/api/system/user'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import TableRightButton from '@/components/TableRightButton'
export default {
  name: 'User',
  components: { Pagination, TopButton, TableRightButton },
  data() {
    return {
      data: null, total: 0, showLoading: false, showFilterContainer: true,
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
      }, 300)
    },
    search() {
      this.qo.page = 1
      this.getData()
    },
    refreshQo() {
      this.$refs.qo.resetFields()
    }
  }
}
</script>
