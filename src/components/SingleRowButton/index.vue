<template>
  <div>
    <template v-if="buttons && buttons.length > 0">
      <el-dropdown v-if="buttons.length > 1" trigger="click" @command="clickCallBack">
        <el-button type="primary" icon="el-icon-s-operation">操作</el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-for="bt in buttons">
            <el-dropdown-item :key="bt.id" :command="bt.click">
              <svg-icon :icon-class="bt.icon" />
              {{ bt.buttonName }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-else type="primary" @click.native.stop="clickCallBack(buttons[0].click)">
        <svg-icon :icon-class="buttons[0].icon" />
        {{ buttons[0].buttonName }}
      </el-button>
    </template>
  </div>
</template>

<script>

export default {
  name: 'SingleRowButton',
  props: {
    baba: {
      type: Object,
      required: true
    },
    // 同一页面存在多个table 时需要此值,详见 dict页
    position: {
      type: String,
      default: 'ROW'
    }
  },
  data() {
    return {
      buttons: undefined
    }
  },
  created() {
    this.getButtons()
  },
  methods: {
    clickCallBack(val) {
      this.baba._self[val](this.baba.row)
    },
    getButtons() {
      const metaButtons = this.$route.meta.buttons
      this.buttons = (metaButtons !== null && metaButtons !== undefined) ? metaButtons[this.position] : []
    }
  }
}
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: white;
    background-color: #11A983;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
