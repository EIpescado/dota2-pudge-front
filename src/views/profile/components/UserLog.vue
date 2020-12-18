<template>
  <!-- <el-timeline style="margin-top: 10px;">
    <el-timeline-item v-for="(item,index) of data" :key="index" :timestamp="item.dateCreated" placement="top" icon="el-icon-s-operation">
      <h4>{{ item.action + ' ' + item.address }}</h4>
    </el-timeline-item>
  </el-timeline> -->
  <div>
    <el-table v-loading="loading" size="medium" :data="data">
      <el-table-column label="IP" prop="ip" />
      <el-table-column label="地点" prop="address" />
      <el-table-column label="操作" prop="action" />
      <el-table-column label="时间" prop="dateCreated" />
    </el-table>

    <!--分页-->
    <Pagination :total="total" :page.sync="qo.page" :limit.sync="qo.size" layout="prev, next" @pagination="getUserLog" />
  </div>
</template>

<script>
import { userLog } from '@/api/system/user'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      qo: { page: 1, size: 10 }, total: 0, loading: false,
      data: []
    }
  },
  created() {
  },
  methods: {
    getUserLog() {
      this.loading = true
      setTimeout(() => {
        userLog(this.qo).then(res => {
          this.data = res.rows
          this.total = res.total
          this.loading = false
        }).catch(() => { this.loading = false })
      }, 300)
    }
  }
}
</script>
