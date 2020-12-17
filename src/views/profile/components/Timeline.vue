<template>
  <el-timeline style="margin-top: 10px;">
    <el-timeline-item v-for="(item,index) of data" :key="index" :timestamp="item.dateCreated" placement="top" icon="el-icon-s-operation">
      <h4>{{ item.action + ' ' + item.address }}</h4>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import { userLog } from '@/api/system/user'
export default {
  data() {
    return {
      qo: { page: 1, size: 5 },
      data: []
    }
  },
  created() {
  },
  methods: {
    getUserLog() {
      userLog(this.qo).then(res => {
        this.data = res.rows
      })
    }
  }
}
</script>
