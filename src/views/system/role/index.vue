<template>
  <div class="app-container">
    <TopButton />
    <el-table ref="table" :data="tableData">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="dateCreated" label="创建时间" />
      <el-table-column prop="lastUpdated" label="修改时间" />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="qo.page" :size.sync="qo.size" @pagination="search" />
  </div>
</template>

<script>
import { list } from '@/api/system/role'
import TopButton from '@/components/TopButton'
import Pagination from '@/components/Pagination'
export default {
  name: 'Role',
  components: { TopButton, Pagination },
  data() {
    return {
      qo: { page: 1, size: 10 }, total: 0,
      tableData: []
    }
  },
  created() {
    this.search()
  },
  methods: {
    search() {
      list(this.qo).then(res => {
        this.total = res.total
        this.tableData = res.rows
      })
    },
    create() {
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
          this.search()
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
