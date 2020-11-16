<template>
  <el-dialog :visible.sync="show" :title="isAdd ? '新字典类型' : '编辑字典类型'" append-to-body :close-on-click-modal="false" width="500px" custom-class="form-dialog" @closed="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" label-width="80px" class="form-container">
      <el-form-item label="类型编码" prop="code">
        <el-input v-model.trim="form.code" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="类型名称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createDictType, updateDictType, getDictType } from '@/api/system/dict'
export default {
  name: 'DictTypeForm',
  props: {
    baba: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false, isAdd: false, uid: '', formLoading: false, submitLoading: false, submitDisabled: false,
      form: { code: '', name: '' },
      rules: {
        code: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
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
            createDictType(this.form).then(res => {
              this.cancel()
              this.$message.success({
                message: '新增成功'
              })
              this.baba.getData()
            }).catch(() => {
              this.submitDisabled = false
              this.submitLoading = false
            })
          } else {
            updateDictType(this.uid, this.form).then(res => {
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
      getDictType(id).then(res => {
        this.form = res
        this.formLoading = false
      })
    }
  }
}
</script>
