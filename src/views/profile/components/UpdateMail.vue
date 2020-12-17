<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" title="修改邮箱" append-to-body width="475px" custom-class="form-dialog" @close="cancel">
    <el-form ref="mailForm" :inline="true" :model="mailForm" :rules="rules" class="form-container">
      <el-form-item label="新邮箱" prop="mail">
        <el-row>
          <el-col :span="18">
            <el-input v-model.trim="mailForm.mail" />
          </el-col>
          <el-col :span="6">
            <el-button :loading="codeLoading" :disabled="codeDisabled" type="primary" class="send-mail-code-button" @click="sendMailCode">{{ buttonName }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model.trim="mailForm.code" />
      </el-form-item>
      <el-form-item label="帐号密码" prop="password">
        <el-input v-model.trim="mailForm.password" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import store from '@/store'
import { validEmail } from '@/utils/validate'
import { changeMail, sendChangeMailCode } from '@/api/system/user'
import { encrypt } from '@/utils/rsaEncrypt'
export default {
  name: 'UpdateMail',
  data() {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('新邮箱必填'))
      } else if (value === this.$store.getters.userInfo.mail) {
        callback(new Error('新邮箱不能与旧邮箱相同'))
      } else if (validEmail(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式错误'))
      }
    }
    return {
      dialog: false,
      mailForm: { mail: '', password: '', code: '' }, submitLoading: false, submitDisabled: false,
      codeLoading: false, buttonName: '获取验证码', codeDisabled: false, time: 60,
      rules: {
        password: [
          { required: true, message: '当前密码不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, validator: validMail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    sendMailCode() {
      if (this.mailForm.mail) {
        if (this.mailForm.mail === this.$store.getters.userInfo.mail) {
          this.$message.warning('新邮箱不能与旧邮箱相同')
        } else {
          this.codeDisabled = true
          this.codeLoading = true
          this.buttonName = '发送中'
          const _this = this
          sendChangeMailCode(this.mailForm.mail).then(res => {
            this.$message.success('验证码已发送到邮箱，请及时查看(有效期5分分钟)')
            this.codeLoading = false
            this.codeDisabled = true
            this.buttonName = (this.time--) + '秒'
            this.timer = window.setInterval(function() {
              _this.buttonName = _this.time + '秒'
              --_this.time
              if (_this.time < 0) {
                _this.buttonName = '重新发送'
                _this.time = 60
                _this.codeDisabled = false
                window.clearInterval(_this.timer)
              }
            }, 1000)
          }).catch(() => {
            this.$message.error('发送失败,稍后重试')
          })
        }
      } else {
        this.$message.warning('请输入有效邮箱')
      }
    },
    doSubmit() {
      this.$refs['mailForm'].validate((valid) => {
        if (valid) {
          this.submitDisabled = true
          this.submitLoading = true
          const submitForm = {
            mail: this.mailForm.mail, password: encrypt(this.mailForm.password), code: this.mailForm.code
          }
          setTimeout(() => {
            changeMail(submitForm).then(res => {
              this.$notify.success({
                title: '邮箱修改成功'
              })
              this.resetForm()
              store.dispatch('GetInfo')
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
      this.$refs['mailForm'].resetFields()
      window.clearInterval(this.timer)
      this.time = 60
      this.buttonName = '获取验证码'
      this.codeLoading = false
      this.codeDisabled = false
      this.submitDisabled = false
      this.submitLoading = false
    }
  }
}
</script>

<style scoped>
.send-mail-code-button{
  margin-left: 5px;
  padding: 9px 11px;
  width: 85px;
}
</style>
