<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="show">选取文件</el-button>
    <FileUploadWindow ref="fileUploadWindow" />
  </div>
</template>

<script>
import FileUploadWindow from '@/components/FileUploadWindow'
export default {
  name: 'Dashboard',
  components: { FileUploadWindow },
  data() {
    return {}
  },
  methods: {
    show() {
      this.$refs.fileUploadWindow.show('上传订单附件')
    }
  }
}
</script>
