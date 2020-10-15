<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="show" :title="isAdd ? '新增菜单' : '编辑菜单'" width="640px" @closed="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model.trim="form.title" placeholder="菜单标题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              width="400"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model.trim="form.icon" placeholder="点击选择图标" readonly style="width:187px;">
                <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="6">
        <el-col :span="8">
          <el-form-item label="外链" prop="iFrame">
            <el-radio-group v-model="form.iFrame" size="mini">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="缓存" prop="cache">
            <el-radio-group v-model="form.noCache" size="mini">
              <el-radio-button :label="false">是</el-radio-button>
              <el-radio-button :label="true">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="隐藏" prop="hidden">
            <el-radio-group v-model="form.hidden" size="mini">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="常驻Tag" prop="affix">
            <el-radio-group v-model="form.affix" size="mini">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="面包屑" prop="breadCrumb">
            <el-radio-group v-model="form.breadCrumb" size="mini">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-show="!form.iFrame" :gutter="10">
        <el-col :span="12">
          <el-form-item label="组件名称" prop="routerName">
            <el-input v-model.trim="form.routerName" placeholder="匹配组件内Name字段" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model.trim="form.component" placeholder="组件路径" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model.trim="form.path" placeholder="路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model.trim="form.permission" :disabled="form.iFrame" placeholder="权限标识" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="排序号" prop="sortNo">
            <el-input-number v-model.number="form.sortNo" :min="0" controls-position="right" style="width:183px;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高亮路径" prop="activeMenu">
            <el-input v-model.trim="form.activeMenu" placeholder="高亮菜单路径" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上级类目" prop="pid">
        <treeselect
          v-model="form.pid"
          :options="menus"
          :normalizer="normalizer"
          style="width: 490px;"
          placeholder="选择上级类目"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update, get } from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'MenuForm',
  components: { Treeselect, IconSelect },
  data() {
    return {
      form: {
        id: '', title: '', routerName: '', pid: undefined, component: 'Layout', breadCrumb: true, activeMenu: '',
        path: '', icon: '', iFrame: false, noCache: true, affix: false, hidden: false, permission: '', sortNo: ''
      },
      rules: {
        title: [
          { required: true, message: '标题必填', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请选择图标', trigger: 'change' }
        ],
        routerName: [
          { required: true, message: '组件名称必填', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '组件路径必填', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址必填', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '权限标识必填', trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '排序号必填', trigger: 'blur' }
        ]
      },
      show: false, isAdd: false, menus: [], formLoading: false, submitLoading: false, submitDisabled: false
    }
  },
  created() {
  },
  methods: {
    createOpen() {
      this.show = true
      this.menus = this.$parent.$data.tableData
      this.isAdd = true
    },
    updateOpen(id) {
      this.show = true
      this.formLoading = true
      this.menus = this.$parent.$data.tableData
      this.isAdd = false
      get(id).then(res => {
        this.form = res
        this.formLoading = false
      })
    },
    cancel() {
      this.submitDisabled = false
      this.submitLoading = false
      this.show = false
      this.$refs.form.resetFields()
    },
    submit() {
      this.submitDisabled = true
      this.submitLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            create(this.form).then(res => {
              this.cancel()
              this.$message.success({
                message: '菜单创建成功'
              })
              this.$parent.wholeTree()
            }).catch(() => {
              this.submitDisabled = false
              this.submitLoading = false
            })
          } else {
            update(this.form.id, this.form).then(res => {
              this.cancel()
              this.$message.success({
                message: '菜单修改成功'
              })
              this.$parent.wholeTree()
            }).catch(() => {
              this.submitDisabled = false
              this.submitLoading = false
            })
          }
        } else {
          this.submitDisabled = false
          this.submitLoading = false
          return false
        }
      })
    },
    selected(name) {
      this.form.icon = name
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children !== undefined && node.children !== null && node.children.length > 0 ? node.children : undefined,
        isDisabled: node.whetherButton
      }
    }
  }
}
</script>
<style lang="scss">
.el-input__inner{
  text-align: left !important;
}
</style>
