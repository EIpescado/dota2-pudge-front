<template>
  <div class="filter-button-container">
    <el-button type="primary" size="small" icon="el-icon-search" @click="search">
      搜索
    </el-button>
    <el-button size="small" icon="el-icon-refresh" @click="refreshQo">
      重置
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'FilterButton',
  props: {
    baba: {
      type: Object,
      required: true
    },
    getDataFun: {
      type: String,
      default: 'getData'
    },
    qoRef: {
      type: String,
      default: 'qo'
    },
    pageable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    search() {
      if (this.pageable) {
        this.baba.$data[this.qoRef].page = 1
      }
      this.baba[this.getDataFun]()
    },
    refreshQo() {
      this.baba.$refs[this.qoRef].resetFields()
    }
  }
}
</script>
