<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="qo.type" clearable>
            <el-option v-for="item in this.$store.getters.dictSelectData.system_notice_type" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
      </el-form>
      <!--查询框按钮-->
      <FilterButton :baba="this" />
    </div>

    <!--顶部按钮-->
    <TopButton :baba="this" />

    <!--列表-->
    <el-table ref="table" v-loading="showLoading" :data="data" highlight-current-row class="table-container">
      <el-table-column label="标题">
        <template slot-scope="{row}">
          <el-link type="primary" @click="showNoticeDialog(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="公告类型" width="150px">
        <template slot-scope="{row}">
          <el-tag type="success" effect="light">{{ formatType(row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" prop="expiredDate" width="150px" />
      <el-table-column label="创建日期" prop="dateCreated" width="150px" />
      <el-table-column label="修改日期" prop="lastUpdated" width="150px">
        <template slot-scope="scope">
          <DateTimeHumanizer :value="scope.row.lastUpdated" />
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

    <NoticeDialog ref="noticeDialog" />
  </div>
</template>

<script>
import { list } from '@/api/system/notice'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import SingleRowButton from '@/components/SingleRowButton'
import FilterButton from '@/components/FilterButton'
import NoticeDialog from '@/components/NoticeDialog'
import DateTimeHumanizer from '@/components/DateTimeHumanizer'
import { getDictSelectData, transferValueForArray } from '@/utils/common'
export default {
  name: 'NoticeList',
  components: { Pagination, TopButton, FilterButton, SingleRowButton, NoticeDialog, DateTimeHumanizer },
  data() {
    return {
      showLoading: false, data: [], total: 0,
      qo: { page: 1, size: 10, type: '', title: '' },
      typeOptions: []
    }
  },
  created() {
    getDictSelectData('system_notice_type').then(res => { this.getData() })
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
      this.$router.push({ path: '/system/notice/create' })
    },
    update(row) {
      this.$router.push({ path: '/system/notice/edit', query: { id: row.id }})
    },
    showNoticeDialog(row) {
      this.$refs.noticeDialog.show(row.id)
    },
    formatType(row) {
      return transferValueForArray('system_notice_type', row.type)
    }
  }
}
</script>
