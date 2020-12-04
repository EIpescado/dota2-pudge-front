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
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="pudge-table-expand">
            <el-form-item label="请求方法">
              <span>{{ row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ row.params }}</span>
            </el-form-item>
            <el-form-item v-if="row.errorInfo" label="异常信息">
              <span>{{ row.errorInfo }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户" prop="nickname" />
      <el-table-column label="类型">
        <template slot-scope="{row}">
          <DictValueFormatter dict-type="system_log_type" :dict-value="row.type" />
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="ip" />
      <el-table-column label="IP来源" prop="address" />
      <el-table-column label="操作" prop="action" />
      <el-table-column label="系统" show-overflow-tooltip prop="system" />
      <el-table-column label="浏览器" prop="browser" />
      <el-table-column label="耗时" prop="timeCost">
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

  </div>
</template>
<script>
import { list } from '@/api/system/log'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import TableRightButton from '@/components/TableRightButton'
import FilterButton from '@/components/FilterButton'
import DictValueFormatter from '@/components/DictValueFormatter'
import { getDictSelectData } from '@/utils/common'
export default {
  name: 'Log',
  components: { Pagination, TopButton, TableRightButton, FilterButton, DictValueFormatter },
  data() {
    return {
      showLoading: false, data: null, total: 0,
      qo: { page: 1, size: 10, keyWord: '' }
    }
  },
  created() {
    getDictSelectData('system_log_type', this).then(() => {
      this.getData()
    })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.pudge-table-expand {
  font-size: 0;
}
.pudge-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.pudge-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.pudge-table-expand .el-form-item__content {
  font-size: 12px;
}
</style>
