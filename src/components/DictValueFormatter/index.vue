<template>
  <el-tag type="info" effect="plain">{{ value }}</el-tag>
</template>

<script>
// 使用el-table中的formatter或插槽数据会多次执行 formatter中的函数
export default {
  name: 'DictValueFormatter',
  props: {
    dictType: {
      type: String,
      required: true
    },
    dictValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.formatDictValueToLabel()
  },
  methods: {
    formatDictValueToLabel() {
      if (!this.dictValue) {
        this.value = ''
      } else {
        const dictSelectData = this.$store.getters.dictSelectData
        const haveData = dictSelectData && dictSelectData[this.dictType] && dictSelectData[this.dictType].length > 0
        let result = this.dictValue
        if (haveData) {
          for (const dictRow of dictSelectData[this.dictType]) {
            if (dictRow.value === this.dictValue) {
              result = dictRow.label
              break
            }
          }
        }
        this.value = result
      }
    }
  }
}
</script>
