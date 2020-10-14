<template>
  <div>
    <template v-if="buttons && buttons.length > 0">
      <el-dropdown v-if="buttons.length > 1" @command="clickCallBack">
        <el-button size="mini" type="primary" icon="el-icon-s-operation">操作</el-button>
        <el-dropdown-menu slot="dropdown" split-button>
          <template v-for="bt in buttons">
            <el-dropdown-item :key="bt.id" :command="bt.click">
              <svg-icon :icon-class="bt.icon" />
              {{ bt.buttonName }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-else size="mini" type="primary" @click="clickCallBack(buttons[0].click)">
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
    row: {
      type: Object,
      required: true
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
      // 嵌套三层 table => table-container => app-container
      this.$parent.$parent.$parent[val](this.row)
    },
    getButtons() {
      const metaButtons = this.$route.meta.buttons
      this.buttons = (metaButtons !== null && metaButtons !== undefined) ? metaButtons.ROW : []
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
