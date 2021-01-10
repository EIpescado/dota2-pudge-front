<template>
  <el-card>
    <div class="file-upload-container-header">
      <el-button :loading="uploadLoading" :disabled="uploadDisabled" type="primary" style="float: right;" @click="handleUpload">上传到服务器</el-button>
    </div>
    <el-upload
      ref="upload"
      multiple
      action="#"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false"
      class="file-upload-container"
    >
      <el-button slot="trigger" type="primary">选取文件</el-button>
    </el-upload>
  </el-card>
</template>

<script>
import { upload } from '@/api/system/file'
import { getDataInArrayByKeyEq } from '@/utils/common'
export default {
  name: 'FileUploadWindow',
  data() {
    return {
      fileList: [],
      uploadLoading: false, uploadDisabled: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleUpload() {
      console.log(this.uploadDisabled)
      this.uploadDisabled = true
      this.uploadLoading = true
      const fileList = this.fileList
      if (fileList && fileList.length > 0) {
        const formData = new FormData()
        let needUpload = false
        fileList.forEach(r => {
          // 过滤出需要上传的文件,已经上传的不用再次上传
          if (!r.id || r.status !== 'success') {
            formData.append('files', r.raw)
            formData.append('uidList', r.uid)
            needUpload = true
          }
        })
        if (needUpload) {
          upload(1, formData).then(res => {
            // 将已经上传成功的文件状态标记为success,并将ID存入
            let matchResult
            fileList.forEach(r => {
              matchResult = getDataInArrayByKeyEq(r.uid.toString(), res, 'uid')
              if (matchResult) {
                r.id = matchResult.id
                r.status = 'success'
              }
            })
            this.uploadDisabled = false
            this.uploadLoading = false
            this.$message.success('上传成功,本次共上传' + res.length + '个文件')
          }).catch(() => {
            this.uploadDisabled = false
            this.uploadLoading = false
          })
        } else {
          this.$message.warning('没有需要上传的文件')
          this.uploadDisabled = false
          this.uploadLoading = false
        }
      } else {
        this.$message.warning('请选取你要上传的文件')
        this.uploadDisabled = false
        this.uploadLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
.file-upload-container{
  .upload-file-title{
    padding: 9px 0;
    font-size: 14px;
    display: inline-block;
    white-space: nowrap;
    text-align: center;
    margin: 0;
    font-weight: 600;
  }
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
