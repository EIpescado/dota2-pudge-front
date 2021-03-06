<template>
  <el-card class="upload-card">
    <el-upload
      action=""
      multiple
      :drag="drag"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :limit="limit"
      :accept="accept"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      :before-upload="handleBefore"
      :auto-upload="true"
      :http-request="uploadFile"
      class="file-upload-container"
    >
      <el-button v-if="!drag" slot="trigger" type="primary">选取文件</el-button>
      <i v-if="drag" class="el-icon-upload" />
      <div v-if="drag" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div v-if="otherTip" class="el-upload__tip">{{ otherTip }}</div>
      <div v-if="accept && maxSizeStr" slot="tip" class="el-upload__tip">最多上传{{ limit }}个文件({{ accept }})，单个文件大小不可超过{{ maxSizeStr }}</div>
    </el-upload>
  </el-card>
</template>

<script>
import { upload } from '@/api/system/file'
import { formatBytes } from '@/utils/index'
export default {
  name: 'FileUpload',
  props: {
    fileTag: {
      type: Number,
      required: true
    },
    // 上传文件最大数量
    limit: {
      type: Number,
      default: 5
    },
    // 接受的文件类型, 还需在beforeupload中过滤,因为仍可选择,此选项只是从文件列表过滤,形如 pdf,jpg
    accept: {
      type: String,
      default: undefined
    },
    // 上传的单个文件的最大大小
    maxSize: {
      type: Number,
      default: 15 * 1024 * 1024
    },
    drag: {
      type: Boolean,
      default: false
    },
    otherTip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [], maxSizeStr: formatBytes(this.maxSize)
    }
  },
  methods: {
    uploadFile(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      upload(this.fileTag, file.file.type, formData, (progressEvent) => {
        // 上传百分比
        const num = progressEvent.loaded / progressEvent.total * 100 | 0
        file.onProgress({ percent: num })
      }).then(data => {
        file.id = data.id
        // 标记为上传完毕
        file.onSuccess()
      }).catch(() => {
        // 标记为上传失败 自动移除
        file.onError()
      })
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.error('最多上传' + this.limit + '个文件')
    },
    handleProgress(event, file, fileList) {
      // 覆盖默认的progress
    },
    handleBefore(file) {
      if (this.maxSize && this.maxSize > 0 && file.size > this.maxSize) {
        this.$message.error(file.name + ' 超出上传文件大小限制')
        return false
      }
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (this.accept && this.accept.indexOf(extension) === -1) {
        this.$message.error('仅可上传 ' + this.accept)
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
.upload-card{ max-height:320px;overflow:auto; }
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
</style>
