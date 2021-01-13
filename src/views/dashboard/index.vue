<template>
  <div class="dashboard-container">
    <el-row style="margin:20px;">
      <el-col :span="4">
        <FileUpload :file-tag="1" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload'
export default {
  name: 'Dashboard',
  components: { FileUpload },
  data() {
    return {}
  },
  methods: {
  }
}
</script>
