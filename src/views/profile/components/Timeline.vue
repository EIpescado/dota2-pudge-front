<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of data" :key="index" :timestamp="item.dateCreated" placement="top">
        <el-card>
          <h4>{{ item.action }}</h4>
          <p>{{ item.ip + ' ' + item.address }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { userLog } from '@/api/system/user'
export default {
  data() {
    return {
      qo: { page: 1, size: 10 },
      data: []
    }
  },
  created() {
    this.userLog()
  },
  methods: {
    userLog() {
      userLog(this.qo).then(res => {
        this.data = res.rows
      })
    }
  }
}
</script>
