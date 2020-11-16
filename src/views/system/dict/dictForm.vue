<template>
  <el-dialog :visible.sync="show" :title="isAdd ? '新字典' : '编辑字典'" append-to-body :close-on-click-modal="false" width="500px" custom-class="form-dialog" @closed="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" label-width="80px" class="form-container">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item label="字典值" prop="val">
        <el-input v-model.trim="form.val" />
      </el-form-item>
      <el-form-item label="字典类型" prop="typeCode">
        <el-input v-model.trim="form.typeCode" disabled />
      </el-form-item>
      <el-form-item label="排序号" prop="seq">
        <el-input-number v-model.number="form.seq" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="固定" prop="fixed">
        <el-radio-group v-model="form.fixed" size="mini">
          <el-radio-button :label="true">是</el-radio-button>
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update, get } from '@/api/system/dict'
export default {
  name: 'DictForm',
  props: {
    baba: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false, isAdd: false, uid: '', formLoading: false, submitLoading: false, submitDisabled: false,
      form: { val: '', name: '', seq: '', typeCode: '', fixed: false },
      rules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        val: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '字典类型必填', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '请输入字典排序号', trigger: 'blur' }
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
                message: '新增成功'
              })
              this.baba.getDictData()
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
              this.baba.getDictData()
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
    createOpen(typeCode) {
      this.show = true
      this.isAdd = true
      this.form.typeCode = typeCode
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
    }
  }
}
</script>
