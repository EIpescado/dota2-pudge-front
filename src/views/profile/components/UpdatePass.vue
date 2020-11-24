<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" title="修改密码" append-to-body width="450px" custom-class="form-dialog" @close="cancel">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" class="form-container">
      <el-form-item label="旧密码" prop="oldPass">
        <el-input v-model.trim="form.oldPass" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input v-model.trim="form.newPass" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPass">
        <el-input v-model.trim="form.confirmPass" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changePassword } from '@/api/system/user'
import { validPassword, createValidator } from '@/utils/validate'
import { encrypt } from '@/utils/rsaEncrypt'
export default {
  name: 'UpdatePass',
  data() {
    const passwordValidator = createValidator(true, validPassword, '字母开头，6~18位，字母、数字和下划线', '新密码必填')
    const confirmPass = (rule, value, callback) => {
      if (value) {
        if (this.form.newPass !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请再次输入新密码'))
      }
    }
    return {
      dialog: false,
      submitLoading: false, submitDisabled: false, form: { oldPass: '', newPass: '', confirmPass: '' },
      rules: {
        oldPass: [
          { required: true, message: '旧密码必填', trigger: 'blur' }
        ],
        newPass: [
          { required: true, validator: passwordValidator, trigger: 'blur' }
        ],
        confirmPass: [
          { required: true, validator: confirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitDisabled = true
          this.submitLoading = true
          setTimeout(() => {
            const newCipherPass = encrypt(this.form.newPass)
            const submitform = {
              oldPass: encrypt(this.form.oldPass),
              newPass: newCipherPass,
              confirmPass: newCipherPass
            }
            changePassword(submitform).then(res => {
              this.resetForm()
              this.$notify.success({
                title: '修改成功',
                message: '请重新登录'
              })
              this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }).catch(() => {
              this.submitDisabled = false
              this.submitLoading = false
            })
          }, 700)
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.submitDisabled = false
      this.submitLoading = false
    }
  }
}
</script>
