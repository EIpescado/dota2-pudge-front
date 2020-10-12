<template>
  <div class="table-left-button-container">
    <el-button-group>
      <el-button size="mini" icon="el-icon-search" @click="switchShowFilterContainer" />
      <el-button size="mini" icon="el-icon-refresh" @click="refresh" />
      <el-popover placement="bottom-end" width="150" trigger="click" @show="getTableFields">
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
export default {
  name: 'TableRightButton',
  props: {
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
      const filterContainer = this.$parent.$refs.filterContainer
      let resultClass = filterContainer.getAttribute('class')
      if (resultClass.indexOf('hidden') !== -1) {
        resultClass = 'filter-container'
      } else {
        resultClass = 'filter-container-hidden'
      }
      filterContainer.setAttribute('class', resultClass)
    },
    refresh() {
      this.$parent.getData()
    },
    getTableFields() {
      if (!this.tableColumns || this.tableColumns.length === 0) {
        const tableColumnArray = []
        const allTableColumnArray = []
        this.$parent.$refs.table.columns.forEach(r => {
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
<style scoped>
.table-left-button-container{
  float: right;
  margin: 0 0 10px 0;
}
</style>
