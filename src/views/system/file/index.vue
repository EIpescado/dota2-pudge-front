<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="关键字" prop="keyWord">
          <el-input v-model.trim="qo.keyWord" clearable />
        </el-form-item>
        <el-form-item label="文件用途" prop="fileTag">
          <el-select v-model="qo.fileTag" clearable>
            <el-option v-for="item in this.$store.getters.dictSelectData.system_file_tag" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
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
      <el-table-column type="selection" width="55" />
      <el-table-column label="文件名称" prop="fileName" />
      <el-table-column label="文件类型" prop="fileType" width="80" />
      <el-table-column label="MIME_TYPE" prop="mimeType" width="200" />
      <el-table-column label="文件大小" width="100">
        <template slot-scope="{row}">
          {{ formatFileSize(row) }}
        </template>
      </el-table-column>
      <el-table-column label="文件用途">
        <template slot-scope="{row}">
          <el-tag type="success" effect="light">{{ formatFileTag(row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="存储路径" prop="filePath" />
      <el-table-column label="上传用户" prop="nickname" width="100" />
      <el-table-column label="上传时间" prop="uploadDate" />
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <!-- 右侧按钮 -->
          <SingleRowButton :baba="scope" />
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <Pagination :total="total" :page.sync="qo.page" :limit.sync="qo.size" @pagination="getData" />

  </div>
</template>
<script>
import { list, download, downloadZip } from '@/api/system/file'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import SingleRowButton from '@/components/SingleRowButton'
import TableRightButton from '@/components/TableRightButton'
import FilterButton from '@/components/FilterButton'
import { getDictSelectData, transferValueForArray } from '@/utils/common'
import { formatBytes } from '@/utils/index'
export default {
  name: 'File',
  components: { Pagination, TopButton, TableRightButton, FilterButton, SingleRowButton },
  data() {
    return {
      showLoading: false, data: null, total: 0,
      qo: { page: 1, size: 10, keyWord: '', fileTag: '' }
    }
  },
  created() {
    getDictSelectData('system_file_tag').then(res => { this.getData() })
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
    formatFileTag(row) {
      return transferValueForArray('system_file_tag', row.fileTag)
    },
    formatFileSize(row) {
      return formatBytes(row.fileSize, 2)
    },
    download(row) {
      download(row.id)
    },
    downloadZip() {
      const rows = this.$refs.table.selection
      if (rows && rows.length > 0) {
        const ids = []
        rows.forEach(element => { ids.push(element.id) })
        downloadZip(ids).then(res => {
          this.$message.success('下载成功,文件将打包成ZIP')
        })
      } else {
        this.$message.warning('请选中至少一条')
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
