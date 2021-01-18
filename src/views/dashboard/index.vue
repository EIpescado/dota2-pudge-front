<template>
  <div class="dashboard-container">
    <el-row style="margin:20px;">
      <el-col :span="4">
        <FileUpload :file-tag="1" />
      </el-col>
      <el-col :span="4">
        <SystemFileWindow :zip="true" />
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
  }
}
</script>
