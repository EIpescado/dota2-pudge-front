<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model.trim="qo.keyword" clearable />
        </el-form-item>
      </el-form>
      <!--查询框按钮-->
      <FilterButton :baba="this" />
    </div>

    <!--顶部按钮-->
    <TopButton :baba="this" />

    <!--列表-->
    <el-table ref="table" v-loading="showLoading" :data="data" highlight-current-row class="table-container">
      <el-table-column label="用户" prop="nickname" />
      <el-table-column label="类型" prop="type">
        <template slot-scope="{row}">
          <el-tag :type="row.type === '1' ? 'success' : 'danger'" effect="light">{{ formatType(row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="ip" width="120px" />
      <el-table-column label="IP来源" prop="address" />
      <el-table-column label="操作" prop="action" />
      <el-table-column label="请求方法" prop="method" show-overflow-tooltip />
      <el-table-column label="请求参数" width="80px">
        <template slot-scope="{row}">
          <el-link type="primary" @click="showMultiWindow(row, false)">查看参数</el-link>
        </template>
      </el-table-column>
      <el-table-column label="异常信息" width="80px">
        <template slot-scope="{row}">
          <el-link v-if="row.type === '2'" type="danger" @click="showMultiWindow(row, true)">查看异常</el-link>
        </template>
      </el-table-column>
      <el-table-column label="系统" show-overflow-tooltip prop="system" />
      <el-table-column label="浏览器" prop="browser" />
      <el-table-column label="耗时" prop="timeCost" width="75px">
        <template slot-scope="{row}">
          <el-tag v-if="row.timeCost <= 300">{{ row.timeCost }}ms</el-tag>
          <el-tag v-else-if="row.timeCost <= 1000" type="warning">{{ row.timeCost }}ms</el-tag>
          <el-tag v-else type="danger">{{ row.timeCost }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="dateCreated" />
    </el-table>

    <!--分页-->
    <Pagination :total="total" :page.sync="qo.page" :limit.sync="qo.size" @pagination="getData" />

    <!--请求参数-->
    <MultiFunctionalWindow ref="multiWindow" />

  </div>
</template>
<script>
import { list, get } from '@/api/system/log'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import FilterButton from '@/components/FilterButton'
import MultiFunctionalWindow from '@/components/MultiFunctionalWindow'
import { getDictSelectData, transferValueForArray } from '@/utils/common'
export default {
  name: 'Log',
  components: { Pagination, TopButton, FilterButton, MultiFunctionalWindow },
  data() {
    return {
      showLoading: false, data: [], total: 0,
      qo: { page: 1, size: 10, keyword: '' }
    }
  },
  created() {
    getDictSelectData('system_log_type').then(res => { this.getData() })
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
    showMultiWindow(row, isError) {
      const ld = this.$loading()
      get(row.id).then(res => {
        let title = '请求参数'
        let contentType = 'JSON'
        let content = res.params
        if (isError) {
          title = '异常信息'
          contentType = ''
          content = res.errorInfo
        }
        ld.close()
        this.$refs.multiWindow.show(title, content, contentType)
      }).catch(() => { ld.close() })
    },
    formatType(row) {
      return transferValueForArray('system_log_type', row.type)
    }
  }
}
</script>
