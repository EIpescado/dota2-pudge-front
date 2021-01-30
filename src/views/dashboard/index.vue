<template>
  <div class="dashboard-container">
    <el-row style="margin:20px;">
      <el-col :span="6">
        <FileUpload :file-tag="1" :drag="true" />
      </el-col>
      <el-col :span="4" style="margin:20px;">
        <el-button type="primary" @click="showFileWindow">附件窗口</el-button>
        <SystemFileWindow ref="sfw" :zip="false" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload'
import SystemFileWindow from '@/components/SystemFileWindow'
export default {
  name: 'Dashboard',
  components: { FileUpload, SystemFileWindow },
  data() {
    return {}
  },
  methods: {
    showFileWindow() {
      this.$refs.sfw.showFileList('1317296928130662402', '测试附件')
    }
  }
}
</script>
