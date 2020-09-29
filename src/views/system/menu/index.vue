<template>
  <div class="app-container">
    <TopButton />
    <el-table :data="data" row-key="id">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="meta.title" label="菜单标题" min-width="180px" />
      <el-table-column prop="sortNo" label="排序号" min-width="80px" />
      <el-table-column prop="meta.icon" label="图标" align="center" width="50px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.meta.icon ? scope.row.meta.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称" show-overflow-tooltip />
      <el-table-column prop="component" label="组件" />
      <el-table-column prop="path" label="路径" show-overflow-tooltip />
      <el-table-column prop="redirect" label="跳转" show-overflow-tooltip />
      <el-table-column prop="iFrame" label="外链" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.iFrame">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="noCache" label="缓存" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.noCache">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="可见" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="affix" label="常驻" width="50px">
        <template slot-scope="scope">
          <span v-if="scope.row.affix">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="breadCrumb" label="面包屑" width="65px">
        <template slot-scope="scope">
          <span v-if="scope.row.breadCrumb">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { wholeTree } from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import DateRangePicker from '@/components/DateRangePicker'
import TopButton from '@/components/TopButton'

export default {
  name: 'Menu',
  components: { Treeselect, IconSelect, DateRangePicker, TopButton },
  data() {
    return {
      data: []
    }
  },
  created() {
    this.wholeTree()
  },
  methods: {
    wholeTree() {
      wholeTree().then(res => {
        this.data = res
      })
    },
    create() {
      console.log(11111)
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
