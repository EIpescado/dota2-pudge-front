<template>
  <el-dialog :visible.sync="dialog" :title="title" append-to-body :close-on-press-escape="false" @close="cancel">
    <vue-json-pretty v-show="contentType === 'JSON' && json" :data="json" />
    <div v-show="contentType === 'HTML'" v-html="content" />
    <div v-show="contentType === 'String'">{{ content }}</div>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="canCopy" type="primary" @click="copy">复制</el-button>
    </span>
  </el-dialog>
</template>
<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
export default {
  // 多功能窗口
  name: 'MultiFunctionalWindow',
  components: { VueJsonPretty },
  props: {
    // 是否显示copy按钮
    canCopy: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      contentType: '',
      json: undefined, content: '', title: '', dialog: false
    }
  },
  methods: {
    show(title, content, dataType) {
      this.title = title
      this.content = content
      this.contentType = dataType || 'String'
      if (this.contentType === 'JSON') {
        this.json = JSON.parse(content)
      }
      this.dialog = true
    },
    cancel() {
      this.json = ''
      this.content = ''
      this.dialog = false
    },
    copy() {
      this.$copyText(this.content).then(() => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
