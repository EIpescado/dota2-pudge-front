<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="输入框" prop="keyword1">
          <el-input v-model.trim="qo.keyword1" clearable />
        </el-form-item>
        <el-form-item label="下拉1" prop="keyword2">
          <el-select v-model="qo.keyword2" filterable clearable placeholder="请选择订单状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="下拉2" prop="keyword3">
          <el-select v-model="qo.keyword3" filterable allow-create default-first-option clearable placeholder="请选择订单状态2">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="keyword4">
          <date-range-picker v-model="qo.keyword4" range-separator="到" />
        </el-form-item>
        <el-form-item label="显示作废" prop="keyword5">
          <el-checkbox v-model="qo.keyword5" />
        </el-form-item>
      </el-form>
      <!--查询框按钮-->
      <FilterButton :baba="this" />
    </div>

    <!--顶部按钮-->
    <TopButton :baba="this" />

    <!--列表-->
    <el-table ref="table" v-loading="showLoading" :data="data" highlight-current-row class="table-container">
      <el-table-column type="selection" width="55" />
      <el-table-column label="类型" prop="businessType" />
      <el-table-column label="订单号" prop="bookingNo" />
      <el-table-column label="订单日期" prop="bookingDate" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="供应商" prop="supplierName" />
      <el-table-column label="订单总金额" prop="totalAmount" />
      <el-table-column label="币种" prop="currency" />
      <el-table-column label="物流状态" prop="logisticsStatus">
        <template slot-scope="{row}">
          <el-link type="primary">{{ row.logisticsStatus }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="关联文件" prop="fileCount">
        <template slot-scope="{ row }">
          <el-link v-show="row.fileCount && row.fileCount > 0" type="primary" @click="showFileWindow(row)">附件({{ row.fileCount }})</el-link>
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

    <!--附件窗口-->
    <SystemFileWindow ref="sfw" :zip="true" />
  </div>
</template>
<script>
import { list } from '@/api/hfy/bookingOrder'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import SingleRowButton from '@/components/SingleRowButton'
import FilterButton from '@/components/FilterButton'
import DateRangePicker from '@/components/DateRangePicker'
import SystemFileWindow from '@/components/SystemFileWindow'
import { getIdArray } from '@/utils/common'
import { batchGetEntityFileCount } from '@/api/system/file'
export default {
  name: 'BookingOrderList',
  components: { Pagination, TopButton, FilterButton, SingleRowButton, DateRangePicker, SystemFileWindow },
  data() {
    return {
      showLoading: false, data: null, total: 0,
      qo: { page: 1, size: 10, keyword1: '', keyword2: '', keyword3: '', keyword4: [], keyword5: '' },
      options: [{ value: 1, label: '全部' }, { value: 2, label: '暂存' }, { value: 3, label: '受理中' }, { value: 4, label: '已受理' }]
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
          this.asyncGetEntityFileCount(this.data)
        })
      }, 400)
    },
    test(row) {
      this.$message.success({ message: '操作订单' + row.bookingNo })
    },
    batchTest() {
      const rows = this.$refs.table.selection
      if (rows && rows.length > 0) {
        this.$message.success({ message: '操作' + rows.length + '条数据' })
      } else {
        this.$message.warning('请选中至少一条')
      }
    },
    createOrder() {
      // 创建订单
      this.$router.push({ path: '/bookingOrder/create' })
    },
    showFileWindow(row) {
      this.$refs.sfw.showFileList(row.id, row.bookingNo + ' 订单附件')
    },
    asyncGetEntityFileCount(currentDataList) {
      if (currentDataList && currentDataList.length > 0) {
        const entityIds = getIdArray(currentDataList)
        batchGetEntityFileCount(entityIds).then(res => {
          currentDataList.forEach((item, index) => {
            item.fileCount = res[index]
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
