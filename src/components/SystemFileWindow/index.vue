<template>
  <el-dialog :visible.sync="dialog" :title="title" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-table :data="fileList">
      <el-table-column prop="fileName" label="文件名称">
        <template slot-scope="{row}">
          <el-link type="primary" @click="downLoadSingleFile(row.id)">{{ row.fileName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文件用途">
        <template slot-scope="{row}">
          <el-tag type="success" effect="light">{{ formatFileTag(row.fileTag) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="uploadPerson" label="上传人" />
      <el-table-column prop="uploadDate" label="上传时间" />
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="fileList && fileList.length > 0 && zip" type="primary" @click="batchDownLoadInZip">批量下载</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEntityFiles, download, downloadZip } from '@/api/system/file'
import { getIdArray, transferValueForArray, getDictSelectData } from '@/utils/common'
export default {
  name: 'SystemFileWindow',
  props: {
    zip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [], dialog: false, title: '附件'
    }
  },
  created() {
    getDictSelectData('system_file_tag')
  },
  methods: {
    showFileList(entityId, title) {
      if (title) {
        this.title = title
      }
      this.dialog = true
      getEntityFiles(entityId).then(res => { this.fileList = res })
    },
    cancel() {
      this.fileList = []
      this.dialog = false
    },
    downLoadSingleFile(fileId) {
      download(fileId)
    },
    batchDownLoadInZip() {
      const ids = getIdArray(this.fileList)
      if (ids && ids.length > 0) {
        downloadZip(ids)
      }
    },
    formatFileTag(fileTag) {
      return transferValueForArray('system_file_tag', fileTag)
    }
  }
}
</script>
