<template>
  <div class="button-container">
    <template v-for="bt in buttons">
      <el-button :key="bt.id" size="mini" type="primary" class="button-item" round @click="clickCallBack(bt.click)">
        <svg-icon v-if="bt.icon.indexOf('el-icon-') === -1" :icon-class="bt.icon" />
        <i v-else-if="bt.icon.indexOf('el-icon-') !== -1" :class="bt.icon" />
        <i v-else slot="prefix" class="el-icon-question" />
        {{ bt.buttonName }}
      </el-button>
    </template>
  </div>
</template>

<script>

export default {
  name: 'TopButton',
  data() {
    return {
      buttons: []
    }
  },
  created() {
    this.getButtons()
  },
  methods: {
    clickCallBack(val) {
      // this.$emit('listenCall', val)
      this.$parent[val]()
    },
    getButtons() {
      const metaButtons = this.$route.meta.buttons
      this.buttons = metaButtons !== null && metaButtons !== undefined ? metaButtons.TOP : []
    }
  }
}
</script>
