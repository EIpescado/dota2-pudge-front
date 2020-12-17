<template>
  <el-form ref="userForm" :rules="rules" :model="userForm" label-width="50px" style="margin-top: 10px;">
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model.trim="userForm.nickname" clearable style="width: 35%" />
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" style="width: 10%" :loading="submitLoading" :disabled="submitDisabled" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { changeAccountInfo } from '@/api/system/user'
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userForm: { nickname: '' }, submitLoading: false, submitDisabled: false,
      rules: {
        nickname: [
          { required: true, message: '昵称必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.userForm.nickname = this.user.nickname
  },
  methods: {
    submit() {
      this.submitDisabled = true
      this.submitLoading = true
      this.$refs.userForm.validate(valid => {
        if (valid) {
          changeAccountInfo(this.userForm).then(res => {
            this.$message.success({
              message: '保存成功'
            })
            this.submitDisabled = false
            this.submitLoading = false
            this.$store.dispatch('GetInfo')
          }).catch(() => {
            this.submitDisabled = false
            this.submitLoading = false
          })
        } else {
          this.submitDisabled = false
          this.submitLoading = false
          return false
        }
      })
    }
  }
}
</script>
