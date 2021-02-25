<template>
  <el-dialog :visible.sync="dialog" :title="title" :close-on-click-modal="false" append-to-body center width="500px" class="import-template-container" @close="cancel">
    <el-upload
      ref="importTemplate"
      action=""
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :limit="1"
      :accept="accept"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      :auto-upload="false"
      :http-request="uploadFile"
      class="file-upload-container"
    >
      <el-button slot="trigger" type="primary" icon="el-icon-document-add">选取文件</el-button>
      <el-button style="margin-left: 10px;" icon="el-icon-download" @click="downloadTemplate">下载模版</el-button>
      <div v-if="accept && maxSizeStr" slot="tip" class="el-upload__tip">请上传上方固定模版，文件大小不可超过 {{ maxSizeStr }}</div>
    </el-upload>
    <span slot="footer">
      <el-button class="import-template-button" :loading="submitLoading" :disabled="fileList.length !== 1" type="primary" @click="submitImport">上传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { formatBytes } from '@/utils/index'
import { download } from '@/api/system/file'
import { importDict } from '@/api/system/dict'
export default {
  // 数据模版导入组件
  name: 'TemplateImport',
  props: {
    // 父组件
    baba: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    // 模版文件ID
    templateFileId: {
      type: String,
      required: true
    },
    // 上传的单个文件的最大大小
    maxSize: {
      type: Number,
      default: 15 * 1024 * 1024
    }
  },
  data() {
    return {
      dialog: false, accept: 'xlsx', maxSizeStr: formatBytes(this.maxSize), fileList: [], submitLoading: false
    }
  },
  methods: {
    show() {
      this.dialog = true
    },
    handleProgress(event, file, fileList) {
      console.log('handleProgress')
      // 覆盖默认的progress
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleChange(file, fileList) {
      console.log('handleChange')
      if (this.maxSize && this.maxSize > 0 && file.size > this.maxSize) {
        this.fileList = []
        this.$message.error(file.name + ' 超出上传文件大小限制')
        return
      }
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (this.accept && this.accept.indexOf(extension) === -1) {
        this.fileList = []
        this.$message.error('仅可上传 ' + this.accept)
        return
      }
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.error('最多上传1个文件')
    },
    uploadFile(file) {
      this.submitLoading = true
      setTimeout(() => {
        const formData = new FormData()
        formData.append('file', file.file)
        importDict(formData, (progressEvent) => {
          // 上传百分比
          const num = progressEvent.loaded / progressEvent.total * 100 | 0
          file.onProgress({ percent: num })
        }).then(data => {
          // 标记为上传完毕
          file.onSuccess()
          // 导入成功
          this.$message.success('导入成功')
          this.dialog = false
          this.submitLoading = false
        }).catch(() => {
          // 标记为上传失败 自动移除
          file.onError()
          this.submitLoading = false
        })
      }, 300)
    },
    cancel() {
      this.fileList = []
    },
    downloadTemplate() {
      download(this.templateFileId)
    },
    submitImport() {
      this.$refs.importTemplate.submit()
    }
  }

}
</script>
<style lang="scss">
.import-template-container{
  .file-upload-container{
    .el-upload__tip { line-height: 12px;}
    .el-upload-list{
      margin-top: 8px;
      border-top: 1px solid #e6ebf5;
      .el-upload-list__item{
        line-height: 2.5;
        .el-icon-close{ top: 10px; }
      }
    }
  }
  .el-dialog--center .el-dialog__body{
    padding: 25px 25px 10px;
  }
  .import-template-button{
    width: 150px;
  }
}
</style>
