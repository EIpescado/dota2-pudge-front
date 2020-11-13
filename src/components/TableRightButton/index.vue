<template>
  <div class="table-left-button-container">
    <el-button-group>
      <el-tooltip effect="light" content="折叠搜索框" placement="top-start">
        <el-button v-if="showFilter" size="mini" icon="el-icon-search" @click="switchShowFilterContainer" />
      </el-tooltip>
      <el-tooltip effect="light" content="刷新列表" placement="top-start">
        <el-button v-if="showRefresh" size="mini" icon="el-icon-refresh" @click="refresh" />
      </el-tooltip>
      <el-popover v-if="showColCheck" placement="bottom-end" width="150" trigger="click" @show="getTableFields">
        <el-button slot="reference" size="mini" icon="el-icon-s-grid">
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
  name: 'TableRightButton',
  props: {
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
    baba: {
      type: Object,
      required: true
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
      allColumnsSelected: true, allColumnsSelectedIndeterminate: false, tableColumns: [], checkedTableColumns: [], allTableColumns: []
    }
  },
  created() {
  },
  methods: {
    switchShowFilterContainer() {
      const filterContainer = this.baba.$refs[this.filterKey]
      const classVar = 'pudge-hidden'
      if (hasClass(filterContainer, classVar)) {
        removeClass(filterContainer, classVar)
      } else {
        addClass(filterContainer, classVar)
      }
    },
    refresh() {
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
<style lang="scss">
.table-left-button-container{
  float: right;
  margin: 0 0 10px 0;
  .el-button{
    border-radius: 6px !important;
    margin-left: 10px !important;;
  }
}
</style>
