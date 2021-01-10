<template>
  <el-dialog :visible.sync="showUploadWindow" :title="title" append-to-body :close-on-click-modal="false" width="500px" @closed="cancel">
    <el-upload
      ref="upload"
      multiple
      action="#"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false"
      :show-file-list="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
    <div slot="footer">
      <el-button v-show="fileList && fileList.length > 0" type="primary" @click="handleUpload">确认上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { upload } from '@/api/system/file'
export default {
  name: 'FileUploadWindow',
  data() {
    return {
      showUploadWindow: false, title: '',
      fileList: [], haveUploadFileArray: [],
      fileData: ''
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
      const fileList = this.fileList
      if (fileList && fileList.length > 0) {
        const formData = new FormData()
        fileList.forEach(r => {
          formData.append('files', r.raw)
        })
        upload(1, formData).then(res => {
          console.log(res)
          this.cancel()
        })
      }
    },
    show(title, haveUploadFileArray) {
      this.title = title
      this.showUploadWindow = true
      const fileList = []
      if (haveUploadFileArray && haveUploadFileArray.length > 0) {
        haveUploadFileArray.forEach(f => {
          fileList.push({ id: f.id, name: f.fileName, status: 'success' })
        })
      }
      this.fileList = fileList
    },
    cancel() {
      this.fileList = []
      this.showUploadWindow = false
    }
  }
}
</script>
