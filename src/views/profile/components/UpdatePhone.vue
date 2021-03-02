<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" title="换绑手机" append-to-body width="500px" custom-class="form-dialog" @close="cancel">
    <el-form ref="phoneForm" :inline="true" :model="phoneForm" :rules="rules" class="form-container">
      <el-form-item label="新手机号" prop="phone">
        <el-row>
          <el-col :span="18">
            <el-input v-model.trim="phoneForm.phone" />
          </el-col>
          <el-col :span="6">
            <el-button :loading="codeLoading" :disabled="codeDisabled" type="primary" class="send-mail-code-button" @click="sendMailCode">{{ buttonName }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model.trim="phoneForm.code" />
      </el-form-item>
      <el-form-item label="账号密码" prop="password">
        <el-input v-model.trim="phoneForm.password" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validPhone } from '@/utils/validate'
import { changePhone, sendChangePhoneCode } from '@/api/system/user'
import { encrypt } from '@/utils/rsaEncrypt'
export default {
  name: 'UpdatePhone',
  data() {
    const phoneValidator = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('新手机号必填'))
      } else if (value === this.$store.getters.userInfo.mail) {
        callback(new Error('新手机号不能与旧手机号相同'))
      } else if (validPhone(value)) {
        callback()
      } else {
        callback(new Error('无效手机号'))
      }
    }
    return {
      dialog: false,
      phoneForm: { phone: '', password: '', code: '' }, submitLoading: false, submitDisabled: false,
      codeLoading: false, buttonName: '获取验证码', codeDisabled: false, time: 60,
      rules: {
        password: [
          { required: true, message: '当前密码不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: phoneValidator, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '短信验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    sendMailCode() {
      if (this.phoneForm.phone) {
        if (this.phoneForm.phone === this.$store.getters.userInfo.phone) {
          this.$message.warning('新手机号不能与旧手机号相同')
        } else {
          this.codeDisabled = true
          this.codeLoading = true
          if (!validPhone(this.phoneForm.phone)) {
            this.$message.warning('请输入有效手机')
            this.codeDisabled = false
            this.codeLoading = false
            return
          }
          this.buttonName = '发送中'
          const _this = this
          sendChangePhoneCode(this.phoneForm.phone).then(res => {
            this.$message.success('验证码已发送到您手机，请及时查看(有效期5分分钟)')
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
        this.$message.warning('请输入有效手机')
      }
    },
    doSubmit() {
      this.$refs['phoneForm'].validate((valid) => {
        if (valid) {
          this.submitDisabled = true
          this.submitLoading = true
          const submitForm = {
            phone: this.phoneForm.phone, password: encrypt(this.phoneForm.password), code: this.phoneForm.code
          }
          setTimeout(() => {
            changePhone(submitForm).then(res => {
              this.$notify.success({
                title: '手机换绑成功'
              })
              this.resetForm()
              this.$store.dispatch('GetInfo').then(r => {
                this.$parent.getData()
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
      this.$refs['phoneForm'].resetFields()
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
