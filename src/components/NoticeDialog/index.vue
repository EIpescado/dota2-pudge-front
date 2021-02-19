<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" append-to-body @close="cancel">
    <span slot="title" class="notice-title">
      <div class="title">{{ noticeDetail.title }}</div>
      <div class="sub-title">
        <span class="create-date">发布于 {{ noticeDetail.dateCreated }}</span>
        <span class="source">来源: 屠夫</span>
        <span class="tag">标签: {{ formatType(noticeDetail.type) }}</span>
      </div>
    </span>
    <div v-html="noticeDetail.content" />
    <span v-show="footer" slot="footer" class="notice-footer">
      <el-button type="primary">不再显示</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { get } from '@/api/system/notice'
import { getDictSelectData, transferValueForArray } from '@/utils/common'
export default {
  name: 'NoticeDialog',
  props: {
    footer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      noticeDetail: { title: '', content: '', dateCreated: '', type: '' }, dialog: false
    }
  },
  created() {
    getDictSelectData('system_notice_type')
  },
  methods: {
    show(nid) {
      this.dialog = true
      get(nid).then(res => {
        this.noticeDetail = res
      })
    },
    cancel() {
      this.noticeDetail = { title: '', content: '', dateCreated: '', type: '' }
      this.dialog = false
    },
    formatType(type) {
      return transferValueForArray('system_notice_type', type)
    }
  }
}
</script>
<style lang="scss" scope>
.notice-title{
  .title{
    font-size: 28px;
    text-align: center;
    display: block;
    font-weight: bold;
    padding: 20px 20px 10px;
  }
  .sub-title{
    text-align: center;
    color: #666;
    font-size: 12px;
    .create-date{
      margin-right: 15px;
    }
    .source{
      margin-right: 15px;
    }
  }
  div {
    display: block;
  }
}
</style>
