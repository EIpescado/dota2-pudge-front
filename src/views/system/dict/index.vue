<template>
  <div class="app-container">
    <el-row :gutter="10">
      <!--字典类型-->
      <el-col :span="10">
        <el-card shadow="never">
          <!--卡片头-->
          <div slot="header" class="clearfix">
            <span class="card-header-text">字典类型</span>
          </div>
          <!--查询-->
          <div ref="filterContainer" class="card-filter-container">
            <el-form ref="qo" :inline="true" :model="qo">
              <el-form-item label="关键字" label-width="60px" prop="keyword">
                <el-input v-model.trim="qo.keyword" clearable />
              </el-form-item>
              <!--查询框按钮-->
              <FilterButton :baba="this" />
            </el-form>
          </div>
          <!-- 顶部按钮 -->
          <TopButton :baba="this" />
          <!--列表-->
          <el-table ref="table" v-loading="showLoading" :data="dataList" highlight-current-row class="table-container" @row-click="handleRowClick">
            <el-table-column label="编码" prop="code" />
            <el-table-column label="名称" show-overflow-tooltip prop="name" />
            <el-table-column label="修改日期" width="120px" show-overflow-tooltip prop="lastUpdated" />
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

      <!--字典-->
      <el-col :span="14">
        <el-card shadow="never">
          <!--卡片头-->
          <div slot="header" class="clearfix">
            <span class="card-header-text">字典</span>
          </div>
          <div v-if="!dictQo.typeCode" class="click-type-text">
            点击字典类型查询字典
          </div>
          <div v-if="dictQo.typeCode">
            <!--查询-->
            <div ref="dictFilterContainer" class="card-filter-container">
              <el-form ref="dictQo" :inline="true" :model="dictQo" label-width="85px">
                <el-form-item label="字典类型" prop="typeCode">
                  <el-input v-model.trim="dictQo.typeCode" disabled />
                </el-form-item>
                <el-form-item label="关键字" prop="keyword">
                  <el-input v-model.trim="dictQo.keyword" clearable />
                </el-form-item>
                <!--查询框按钮-->
                <FilterButton :baba="this" qo-ref="dictQo" get-data-fun="getDictData" />
              </el-form>
            </div>
            <!-- 顶部按钮 -->
            <TopButton :baba="this" position="DICT_TOP" filter-key="dictFilterContainer" table-data-fun="getDictData" />
            <!--列表-->
            <el-table ref="dictTable" v-loading="dictShowLoading" :data="dictDataList" highlight-current-row class="table-container">
              <el-table-column label="序号" width="50px" prop="seq" />
              <el-table-column label="名称" show-overflow-tooltip prop="name" />
              <el-table-column label="字典值" prop="val" />
              <el-table-column label="固定" width="50px">
                <template slot-scope="{ row }">
                  {{ row.fixed ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column label="修改日期" width="120px" show-overflow-tooltip prop="lastUpdated" />
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <!-- 右侧按钮 -->
                  <SingleRowButton :baba="scope" position="DICT_ROW" />
                </template>
              </el-table-column>
            </el-table>
            <!--分页插件-->
            <pagination :total="dictTotal" :page.sync="dictQo.page" :limit.sync="dictQo.size" @pagination="getDictData" />
          </div>
        </el-card>
      </el-col>

    </el-row>

    <DictTypeForm ref="dictTypeForm" :baba="this" />
    <DictForm ref="dictForm" :baba="this" />
  </div>
</template>

<script>
import { listDictType, deleteDictType, list, deleteDict } from '@/api/system/dict'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import FilterButton from '@/components/FilterButton'
import SingleRowButton from '@/components/SingleRowButton'
import DictTypeForm from './dictTypeForm'
import DictForm from './dictForm'
export default {
  name: 'Dict',
  components: { Pagination, TopButton, FilterButton, SingleRowButton, DictTypeForm, DictForm },
  data() {
    return {
      dataList: null, total: 0, showLoading: false, qo: { page: 1, size: 10, keyword: '' },
      dictDataList: null, dictTotal: 0, dictShowLoading: false, dictQo: { page: 1, size: 10, keyword: '', typeCode: '' }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.showLoading = true
      setTimeout(() => {
        listDictType(this.qo).then(response => {
          this.dataList = response.rows
          this.total = response.total
          this.showLoading = false
        })
      }, 400)
    },
    createDictType() {
      this.$refs.dictTypeForm.createOpen()
    },
    updateDictType(row) {
      this.$refs.dictTypeForm.updateOpen(row.id)
    },
    handleDelete(row) {
      this.$confirm('确认删除此字典类型?', '提示', {
        type: 'warning'
      }).then(() => {
        const ld = this.$loading()
        deleteDictType(row.id).then(res => {
          this.$message.success('删除成功')
          ld.close()
          this.getData()
        })
      }).catch(() => {})
    },
    handleRowClick(row, column, event) {
      this.dictQo.typeCode = row.code
      this.getDictData()
    },
    getDictData() {
      this.dictShowLoading = true
      setTimeout(() => {
        list(this.dictQo).then(res => {
          this.dictDataList = res.rows
          this.dictTotal = res.total
          this.dictShowLoading = false
        })
      }, 400)
    },
    createDict() {
      if (this.dictQo.typeCode) {
        this.$refs.dictForm.createOpen(this.dictQo.typeCode)
      } else {
        this.$message.error('请先点击字典类型')
      }
    },
    updateDict(row) {
      if (row.fixed) {
        this.$message.error('固定字典不可修改')
      } else {
        this.$refs.dictForm.updateOpen(row.id)
      }
    },
    handleDeleteDict(row) {
      if (row.fixed) {
        this.$message.error('固定字典不可删除')
      } else {
        this.$confirm('确认删除此字典?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteDict(row.id).then(res => {
            this.$message.success('删除成功')
            this.getDictData()
          })
        }).catch(() => {})
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.card-header-text {
  font-weight: bold;color: #303133;
  font-size: 15px;
}
.click-type-text{
  font-size: 15px;
}
</style>
