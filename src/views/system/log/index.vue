<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="关键字" prop="keyWord">
          <el-input v-model.trim="qo.keyWord" clearable />
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
      <el-table-column label="用户" prop="nickname" />
      <el-table-column label="类型" prop="type" :formatter="formatter">
        <template slot-scope="{row}">
          <DictValueFormatter :key="row.id" dict-type="system_log_type" :dict-value="row.type" />
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="ip" width="120px" />
      <el-table-column label="IP来源" prop="address" />
      <el-table-column label="操作" prop="action" />
      <el-table-column label="请求方法" prop="method" show-overflow-tooltip />
      <el-table-column label="请求参数" width="80px">
        <template slot-scope="{row}">
          <el-link v-if="row.params" type="primary" @click="showMultiWindow('请求参数', row.params, 'JSON')">查看参数</el-link>
        </template>
      </el-table-column>
      <el-table-column label="异常信息" width="80px">
        <template slot-scope="{row}">
          <el-link v-if="row.errorInfo" type="danger" @click="showMultiWindow('异常信息', row.errorInfo)">查看异常</el-link>
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
import { list } from '@/api/system/log'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import TableRightButton from '@/components/TableRightButton'
import FilterButton from '@/components/FilterButton'
import DictValueFormatter from '@/components/DictValueFormatter'
import MultiFunctionalWindow from '@/components/MultiFunctionalWindow'
import { getDictSelectData } from '@/utils/common'
export default {
  name: 'Log',
  components: { Pagination, TopButton, TableRightButton, FilterButton, DictValueFormatter, MultiFunctionalWindow },
  data() {
    return {
      showLoading: false, data: [], total: 0,
      qo: { page: 1, size: 10, keyWord: '' }
    }
  },
  created() {
    getDictSelectData('system_log_type').then(() => { this.getData() })
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
    showMultiWindow(title, content, contentType) {
      this.$refs.multiWindow.show(title, content, contentType)
    },
    formatter(row, column, cellValue, index) {
      console.log(123456)
      return row.type
    }
  }
}
</script>
