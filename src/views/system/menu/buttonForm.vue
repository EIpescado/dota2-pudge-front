<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="show" :title="isAdd ? '新按钮' : '编辑按钮'" width="640px" @closed="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="按钮名称" prop="buttonName">
            <el-input v-model.trim="form.buttonName" placeholder="按钮名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="按钮图标" prop="icon">
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

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="按钮位置" prop="position">
            <el-input v-model.trim="form.position" placeholder="按钮位置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="绑定函数" prop="click">
            <el-input v-model.trim="form.click" placeholder="按钮绑定函数名称" />
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
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model.trim="form.permission" :disabled="form.iFrame" placeholder="权限标识" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="所属菜单" prop="menuId">
        <treeselect
          v-model="form.menuId"
          :options="menus"
          :normalizer="normalizer"
          style="width: 490px;"
          placeholder="选择所属菜单"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update, get } from '@/api/system/button'
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'ButtonForm',
  components: { Treeselect, IconSelect },
  data() {
    return {
      form: {
        id: '', buttonName: '', icon: '', permission: '', sortNo: '', menuId: undefined, position: '', click: ''
      },
      rules: {
        buttonName: [
          { required: true, message: '请输入按钮名称', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请选择图标', trigger: 'change' }
        ],
        position: [
          { required: true, message: '请选择按钮位置', trigger: 'blur' }
        ],
        click: [
          { required: true, message: '请输入函数', trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '排序号必填', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '权限标识必填', trigger: 'blur' }
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
                message: '按钮创建成功'
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
                message: '按钮修改成功'
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
