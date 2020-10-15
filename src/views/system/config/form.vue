<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="show" :title="isAdd ? '新配置' : '编辑配置'" width="480px" custom-class="form-dialog" @closed="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" size="small" label-width="80px" class="form-container">
      <el-form-item label="配置编码" prop="code">
        <el-input v-model.trim="form.code" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="配置描述" prop="description">
        <el-input v-model.trim="form.description" />
      </el-form-item>
      <el-form-item label="配置值" prop="val">
        <el-input v-model.trim="form.val" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update, get } from '@/api/system/config'
export default {
  name: 'ConfigForm',
  data() {
    return {
      form: { code: '', description: '', val: '' },
      rules: {
        code: [
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '昵称必填', trigger: 'blur' }
        ],
        val: [
          { required: true, message: '手机必填', trigger: 'blur' }
        ]
      },
      show: false, isAdd: false, uid: '', formLoading: false
    }
  },
  created() {
  },
  methods: {
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
        this.form = res
        this.formLoading = false
      })
    },
    cancel() {
      this.show = false
      this.$refs.form.resetFields()
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            create(this.form).then(res => {
              this.cancel()
              this.$message.success({
                message: '创建成功'
              })
              this.$parent.getData()
            })
          } else {
            update(this.uid, this.form).then(res => {
              this.cancel()
              this.$message.success({
                message: '修改成功'
              })
              this.$parent.getData()
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
