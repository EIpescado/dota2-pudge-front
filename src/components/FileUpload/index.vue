<template>
  <el-card class="upload-card">
    <el-upload
      ref="upload"
      action=""
      multiple
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :limit="limit"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      :auto-upload="true"
      :http-request="uploadFile"
      class="file-upload-container"
    >
      <el-button slot="trigger" type="primary">选取文件</el-button>
    </el-upload>
  </el-card>
</template>

<script>
import { upload } from '@/api/system/file'
export default {
  name: 'FileUpload',
  props: {
    limit: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    uploadFile(file) {
      upload(1, file).catch(() => {})
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多上传' + this.limit + '个文件')
    },
    handleProgress(event, file, fileList) {
    }
  }
}
</script>
<style lang="scss">
.file-upload-container{
  .el-upload-list{
    margin: 8px 0 0 0;
    border-top: 1px solid #e6ebf5;
    .el-upload-list__item{
      line-height: 2.5;
      .el-icon-close{
        top: 10px;
      }
    }
  }
}
</style>
