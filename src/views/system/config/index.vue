<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="配置编码" prop="code">
          <el-input v-model.trim="qo.code" clearable />
        </el-form-item>
        <el-form-item label="配置描述" prop="description">
          <el-input v-model.trim="qo.description" clearable />
        </el-form-item>
      </el-form>
      <!--查询框按钮-->
      <FilterButton :baba="this" />
    </div>

    <!--顶部按钮-->
    <TopButton :baba="this" />

    <!--列表-->
    <el-table ref="table" v-loading="showLoading" :data="data" highlight-current-row class="table-container">
      <el-table-column label="配置编码" prop="code" />
      <el-table-column label="配置描述" prop="description" />
      <el-table-column label="配置值" prop="val" />
      <el-table-column label="创建日期" prop="dateCreated" />
      <el-table-column label="修改日期" prop="lastUpdated" />
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
import { list } from '@/api/system/config'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import SingleRowButton from '@/components/SingleRowButton'
import FilterButton from '@/components/FilterButton'
import Form from './form'
export default {
  name: 'Config',
  components: { Pagination, TopButton, FilterButton, Form, SingleRowButton },
  data() {
    return {
      showLoading: false, data: null, total: 0,
      qo: { page: 1, size: 10, code: '', description: '' }
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
    }
  }
}
</script>
