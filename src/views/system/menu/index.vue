<template>
  <div class="app-container">
    <TopButton />
    <el-table ref="table" :data="tableData" row-key="id">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <i :class="scope.row.whetherButton ? 'el-icon-thumb' : 'el-icon-menu'" /> {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="sortNo" label="排序号" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
    </el-table>
    <MenuForm ref="menuForm" />
    <ButtonForm ref="buttonForm" />
  </div>
</template>

<script>
import { wholeTree, deleteNode } from '@/api/system/menu'
import TopButton from '@/components/TopButton'
import MenuForm from './menuForm'
import ButtonForm from './buttonForm'
export default {
  name: 'Menu',
  components: { TopButton, MenuForm, ButtonForm },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.wholeTree()
  },
  methods: {
    wholeTree() {
      wholeTree().then(res => {
        this.tableData = res
      })
    },
    create() {
      this.$refs.menuForm.createOpen()
    },
    createButton() {
      this.$refs.buttonForm.createOpen()
    },
    update() {
      const rows = this.$refs.table.selection
      if (rows && rows.length === 1) {
        const row = rows[0]
        if (row.whetherButton) {
          this.$refs.buttonForm.updateOpen(row.id)
        } else {
          this.$refs.menuForm.updateOpen(row.id)
        }
      } else {
        this.$message.error({
          message: '请选择一个节点'
        })
      }
    },
    deleteNode() {
      const rows = this.$refs.table.selection
      if (rows && rows.length >= 1) {
        this.$confirm('确认删除这' + rows.length + '节点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNode(rows).then(res => {
            this.$message.success({
              message: '删除成功!'
            })
          })
          this.wholeTree()
        }).catch(() => {
        })
      } else {
        this.$message.error({
          message: '请至少选择一个节点'
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
