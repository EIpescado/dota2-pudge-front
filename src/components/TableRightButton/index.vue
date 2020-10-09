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
        <el-checkbox-group v-model="checkedTableColumns" @change="handleCheckedTableColumnsChange">
          <el-checkbox v-for="item in tableColumns" :key="item.property" :label="item.label">
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
      allColumnsSelected: true, allColumnsSelectedIndeterminate: false, tableColumns: [], checkedTableColumns: []
    }
  },
  created() {
  },
  methods: {
    switchShowFilterContainer() {
      const showFilterContainer = this.$parent.$data.showFilterContainer
      this.$parent.$data.showFilterContainer = !showFilterContainer
    },
    refresh() {
      this.$parent.getData()
    },
    getTableFields() {
      if (!this.tableColumns || this.tableColumns.length === 0) {
        const tableColumnArray = []
        this.$parent.$refs.table.columns.forEach(r => {
          tableColumnArray.push({
            label: r.label,
            property: r.property
          })
        })
        this.tableColumns = tableColumnArray
        this.checkedTableColumns = tableColumnArray
      }
    },
    handleCheckAllChange(val) {
      console.log(this.tableColumns,this.checkedTableColumns)
      this.checkedTableColumns = val ? this.tableColumns : []
      this.allColumnsSelectedIndeterminate = false
    },
    handleCheckedTableColumnsChange(value) {
      console.log(value)
      const checkedCount = value.length
      this.allColumnsSelected = checkedCount === this.tableColumns.length
      this.allColumnsSelectedIndeterminate = checkedCount > 0 && checkedCount < this.checkedTableColumns.length
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
