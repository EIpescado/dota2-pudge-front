<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="show">选取文件</el-button>
    <FileUploadWindow ref="fileUploadWindow" />
    <el-row style="margin:20px;">
      <el-col :span="6">
        <FileUpload />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FileUploadWindow from '@/components/FileUploadWindow'
import FileUpload from '@/components/FileUpload'
export default {
  name: 'Dashboard',
  components: { FileUploadWindow, FileUpload },
  data() {
    return {}
  },
  methods: {
    show() {
      this.$refs.fileUploadWindow.show('上传订单附件', [{ id: '1347833580028551170', fileName: 'nginx.conf' }])
    }
  }
}
</script>
