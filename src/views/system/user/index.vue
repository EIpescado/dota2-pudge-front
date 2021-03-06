<template>
  <div class="app-container">

    <!--查询-->
    <div ref="filterContainer" class="filter-container">
      <el-form ref="qo" :inline="true" :model="qo">
        <el-form-item label="用户名" prop="keyword">
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
      <el-table-column label="用户名" resizable prop="username" />
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="手机" prop="phone" />
      <el-table-column label="邮箱" prop="mail" />
      <el-table-column label="注册日期" prop="dateCreated" />
      <el-table-column label="文件" prop="fileCount">
        <template slot-scope="{ row }">
          <el-link v-show="row.fileCount > 0" type="primary" @click="showFileWindow(row)">附件({{ row.fileCount }})</el-link>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state === 1 ? 'success' : 'danger'" effect="light">{{ formatState(row) }}</el-tag>
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

    <Form ref="form" />

    <!--附件窗口-->
    <SystemFileWindow ref="sfw" :zip="false" />
  </div>
</template>

<script>
import { list, resetPassword, enableAccount, disableAccount } from '@/api/system/user'
import { batchGetEntityFileCount } from '@/api/system/file'
import Pagination from '@/components/Pagination'
import TopButton from '@/components/TopButton'
import SingleRowButton from '@/components/SingleRowButton'
import FilterButton from '@/components/FilterButton'
import SystemFileWindow from '@/components/SystemFileWindow'
import { getDictSelectData, transferValueForArray, getIdArray } from '@/utils/common'
import Form from './form'
export default {
  name: 'User',
  components: { Pagination, TopButton, FilterButton, Form, SingleRowButton, SystemFileWindow },
  data() {
    return {
      showLoading: false, data: null, total: 0,
      qo: { page: 1, size: 10, keyword: '' }
    }
  },
  created() {
    getDictSelectData('system_user_state').then(() => { this.getData() })
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
    create() {
      this.$refs.form.createOpen()
    },
    update(row) {
      this.$refs.form.updateOpen(row.id)
    },
    resetPassword(row) {
      this.$confirm('确认重置用户 ' + row.username + ' 密码', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        const ld = this.$loading()
        setTimeout(() => {
          resetPassword(row.id).then(res => {
            this.$message.success('重置成功')
            ld.close()
          }).catch(() => {
            ld.close()
          })
        }, 400)
      }).catch(() => {})
    },
    enableAccount(row) {
      this.$confirm('确认启用用户 ' + row.username, '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        const ld = this.$loading()
        setTimeout(() => {
          enableAccount(row.id).then(res => {
            this.$message.success('用户 ' + row.username + ' 已启用')
            ld.close()
            this.getData()
          }).catch(() => { ld.close() })
        }, 400)
      }).catch(() => {})
    },
    disableAccount(row) {
      this.$confirm('确认禁用用户 ' + row.username, '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        const ld = this.$loading()
        setTimeout(() => {
          disableAccount(row.id).then(res => {
            this.$message.success('用户 ' + row.username + ' 已禁用')
            ld.close()
            this.getData()
          }).catch(() => { ld.close() })
        }, 400)
      }).catch(() => {})
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
    },
    showFileWindow(row) {
      this.$refs.sfw.showFileList(row.id, '用户附件')
    },
    formatState(row) {
      return transferValueForArray('system_user_state', row.state)
    }
  }
}
</script>
