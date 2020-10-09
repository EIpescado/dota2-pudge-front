<template>
  <el-button-group class="top-button-container">
    <template v-for="bt in buttons">
      <el-button :key="bt.id" size="small" type="primary" class="top-button-item" @click="clickCallBack(bt.click)">
        <svg-icon v-if="bt.icon" :icon-class="bt.icon" />
        {{ bt.buttonName }}
      </el-button>
    </template>
  </el-button-group>
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
      this.$parent[val]()
    },
    getButtons() {
      const metaButtons = this.$route.meta.buttons
      this.buttons = metaButtons !== null && metaButtons !== undefined ? metaButtons.TOP : []
    }
  }
}
</script>
