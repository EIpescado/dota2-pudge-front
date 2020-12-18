<template>
  <el-dropdown trigger="click" @command="handleSetSize" @visible-change="showSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SizeSelect',
  props: {
    baba: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      sizeOptions: [
        { label: '超大杯', value: 'medium' },
        { label: '大杯', value: 'small' },
        { label: '中杯', value: 'mini' }
      ]
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  methods: {
    showSize(val) {
      this.baba.closeToolTip('sizeSelect')
    },
    handleDefaultSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('app/setSize', size)
      this.refreshView()
    },
    handleSetSize(size) {
      this.handleDefaultSize(size)
      this.$message({
        message: '切换布局大小成功',
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }

}
</script>
