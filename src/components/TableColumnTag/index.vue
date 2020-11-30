<template>
  <el-tag :type="value ? 'success' : 'warning'" :effect="tagEffect">{{ result }}</el-tag>
</template>

<script>
export default {
  name: 'TableColumnTag',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: 'enabled'
    },
    tagEffect: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {
      result: ''
    }
  },
  created() {
    this.changeBooleanToStr()
  },
  methods: {
    changeBooleanToStr() {
      if (this.type === 'enabled') {
        this.result = this.value ? '启用' : '禁用'
      } else if (this.type === 'yesOrNo') {
        this.result = this.value ? '是' : '否'
      } else {
        return this.value
      }
    }
  }
}
</script>
