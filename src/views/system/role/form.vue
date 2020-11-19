<template>
  <el-dialog :visible.sync="show" :title="isAdd ? '新增角色' : '编辑角色'" append-to-body :close-on-click-modal="false" width="500px" custom-class="form-dialog" @closed="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" class="form-container">
      <el-form-item label="角色编码" prop="name">
        <el-input v-model.trim="form.name" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="form.description" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update, get } from '@/api/system/role'
export default {
  name: 'RoleForm',
  props: {
    baba: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false, isAdd: false, uid: '', formLoading: false, submitLoading: false, submitDisabled: false,
      form: { name: '', description: '' },
      rules: {
        name: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    cancel() {
      this.submitDisabled = false
      this.submitLoading = false
      this.show = false
      this.$refs.form.resetFields()
    },
    submit() {
      this.submitDisabled = true
      this.submitLoading = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            create(this.form).then(res => {
              this.cancel()
              this.$message.success({
                message: '添加成功'
              })
              this.baba.getData()
            }).catch(() => {
              this.submitDisabled = false
              this.submitLoading = false
            })
          } else {
            update(this.uid, this.form).then(res => {
              this.cancel()
              this.$message.success({
                message: '修改成功'
              })
              this.baba.getData()
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
    createOpen() {
      this.show = true
      this.isAdd = true
    },
    updateOpen(id) {
      this.show = true
      this.formLoading = true
      this.isAdd = false
      this.uid = id
      get(id).then(res => {
        this.form.name = res.name
        this.form.description = res.description
        this.formLoading = false
      })
    }
  }
}
</script>
