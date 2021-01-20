<template>
  <div class="top-table-container">
    <el-button-group class="table-right-button-container">
      <template v-for="bt in buttons">
        <el-button :key="bt.id" :size="size" type="primary" class="table-right-button-item" @click="clickCallBack(bt.click)">
          <svg-icon v-if="bt.icon" :icon-class="bt.icon" />
          {{ bt.buttonName }}
        </el-button>
      </template>
    </el-button-group>
    <el-button-group v-show="showRight" class="table-left-button-container">
      <el-tooltip :disabled="searchTooltipDisabled" effect="light" content="折叠搜索框" placement="top-start">
        <el-button v-if="showFilter" icon="el-icon-search" class="table-left-button-item" @click="switchShowFilterContainer" />
      </el-tooltip>
      <el-tooltip :disabled="refreshTooltipDisabled" effect="light" content="刷新" placement="top-start">
        <el-button v-if="showRefresh" icon="el-icon-refresh" class="table-left-button-item" @click="refresh" />
      </el-tooltip>
      <el-popover v-if="showColCheck" placement="bottom-end" width="150" trigger="click" @show="getTableFields">
        <el-button slot="reference" icon="el-icon-s-grid" class="table-left-button-item">
          <i class="fa fa-caret-down" aria-hidden="true" />
        </el-button>
        <el-checkbox v-model="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
          全选
        </el-checkbox>
        <el-checkbox-group v-model="checkedTableColumns" :min="1" @change="handleCheckedTableColumnsChange">
          <el-checkbox v-for="item in tableColumns" :key="item.property" :label="item.property">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-popover>
    </el-button-group>
  </div>
</template>

<script>
import { hasClass, addClass, removeClass } from '@/utils/index'
export default {
  name: 'TopButton',
  props: {
    baba: {
      type: Object,
      required: true
    },
    // 同一页面存在多个table 时需要此值,详见 dict页
    position: {
      type: String,
      default: 'TOP'
    },
    size: {
      type: String,
      default: ''
    },
    showRight: {
      type: Boolean,
      default: true
    },
    showFilter: {
      type: Boolean,
      default: true
    },
    showRefresh: {
      type: Boolean,
      default: true
    },
    showColCheck: {
      type: Boolean,
      default: false
    },
    filterKey: {
      type: String,
      default: 'filterContainer'
    },
    tableKey: {
      type: String,
      default: 'table'
    },
    tableDataFun: {
      type: String,
      default: 'getData'
    }
  },
  data() {
    return {
      buttons: [],
      allColumnsSelected: true, allColumnsSelectedIndeterminate: false, tableColumns: [], checkedTableColumns: [], allTableColumns: [],
      searchTooltipDisabled: false, refreshTooltipDisabled: false
    }
  },
  created() {
    this.getButtons()
  },
  methods: {
    clickCallBack(val) {
      this.baba[val]()
    },
    getButtons() {
      const metaButtons = this.$route.meta.buttons
      this.buttons = metaButtons !== null && metaButtons !== undefined ? metaButtons[this.position] : []
    },
    switchShowFilterContainer() {
      this.searchTooltipDisabled = true
      const filterContainer = this.baba.$refs[this.filterKey]
      const classVar = 'pudge-hidden'
      if (hasClass(filterContainer, classVar)) {
        removeClass(filterContainer, classVar)
      } else {
        addClass(filterContainer, classVar)
      }
    },
    refresh() {
      this.refreshTooltipDisabled = true
      this.baba[this.tableDataFun]()
    },
    getTableFields() {
      if (!this.tableColumns || this.tableColumns.length === 0) {
        const tableColumnArray = []
        const allTableColumnArray = []
        this.baba.$refs[this.tableKey].columns.forEach(r => {
          tableColumnArray.push({
            label: r.label,
            property: r.property
          })
          allTableColumnArray.push(r.property)
        })
        this.tableColumns = tableColumnArray
        this.checkedTableColumns = allTableColumnArray
        this.allTableColumns = allTableColumnArray
      }
    },
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true
        return
      }
      this.checkedTableColumns = val ? this.allTableColumns : []
      this.allColumnsSelectedIndeterminate = false
    },
    handleCheckedTableColumnsChange(value) {
      const checkedCount = value.length
      this.allColumnsSelected = checkedCount === this.tableColumns.length
      this.allColumnsSelectedIndeterminate = checkedCount > 0 && checkedCount < this.tableColumns.length
    }
  }
}
</script>
