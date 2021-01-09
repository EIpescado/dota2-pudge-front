<template>
  <div>{{ result }}</div>
</template>
<script>
// 使用el-table中的formatter或插槽数据会多次执行 formatter中的函数
import { simpleHumanizeTime } from '@/utils'
export default {
  name: 'DateTimeHumanizer',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      result: ''
    }
  },
  created() {
    this.humanizeDateTime()
  },
  methods: {
    humanizeDateTime() {
      if (!this.value) {
        return ''
      } else {
        this.result = simpleHumanizeTime(this.value)
      }
    }
  }
}
</script>
