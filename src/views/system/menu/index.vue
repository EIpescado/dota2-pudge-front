<template>
  <div class="app-container">

    <!-- 顶部按钮 -->
    <TopButton :baba="this" />

    <el-row :gutter="15">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>菜单及按钮树</span>
          </div>
          <el-input v-model.trim="filterText" placeholder="输入关键字进行过滤">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <el-tree
            ref="tree"
            :data="tableData"
            :props="defaultProps"
            :check-strictly="true"
            show-checkbox
            highlight-current
            node-key="id"
            class="filter-tree"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <svg-icon :icon-class="data.icon" />
              <span class="custom-tree-lable">{{ data.sortNo + ' - ' + node.label }}</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <!--菜单表单-->
    <MenuForm ref="menuForm" />
    <!--按钮表单-->
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
      tableData: [], filterText: '', defaultProps: { children: 'children', label: 'name' },
      treeSetTrue: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
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
    filterNode(value, data, node) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    create() {
      this.$refs.menuForm.createOpen()
    },
    createButton() {
      this.$refs.buttonForm.createOpen()
    },
    update() {
      const rows = this.$refs.tree.getCheckedNodes()
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
      const rows = this.$refs.tree.getCheckedNodes()
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
.filter-tree{
  margin-top:16px;
}
.custom-tree-node {
  flex: 1;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .custom-tree-lable {
    margin-left: 8px;
  }
}
</style>
