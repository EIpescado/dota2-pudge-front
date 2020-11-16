<template>
  <el-dialog :visible.sync="show" append-to-body :close-on-click-modal="false" :title="isAdd ? '新增用户' : '编辑用户'" width="400px" custom-class="form-dialog" @closed="cancel">
    <el-form ref="form" v-loading="formLoading" :inline="true" :model="form" :rules="rules" class="form-container">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="form.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model.trim="form.nickname" placeholder="昵称" />
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model.trim="form.phone" placeholder="手机" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds" class="form-item-row">
        <el-select v-model="form.roleIds" multiple placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="submitLoading" :disabled="submitDisabled" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update, get } from '@/api/system/user'
import { select } from '@/api/system/role'
import { createValidator, validUsername, validNickname, validPhone, createRequiredValidator } from '@/utils/validate'
export default {
  name: 'UserForm',
  data() {
    const usernameValidator = createValidator(true, validUsername, '字母开头,字母数字下划线,2-18位', '用户名必填')
    const nicknameValidator = createValidator(true, validNickname, '2-18位中文,字母,数字及下划线', '昵称必填')
    const phoneValidator = createValidator(true, validPhone, '请输入有效手机号', '手机必填')
    const requiredValidator = createRequiredValidator('角色必选')
    return {
      form: { username: '', nickname: '', phone: '', roleIds: [] },
      rules: {
        username: [
          { required: true, validator: usernameValidator, trigger: 'blur' }
        ],
        nickname: [
          { required: true, validator: nicknameValidator, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: phoneValidator, trigger: 'blur' }
        ],
        roleIds: [
          { required: true, validator: requiredValidator, trigger: 'change' }
        ]
      },
      show: false, isAdd: false, roles: [], uid: '', formLoading: false, submitLoading: false, submitDisabled: false
    }
  },
  created() {
  },
  methods: {
    createOpen() {
      this.show = true
      this.select()
      this.isAdd = true
    },
    updateOpen(id) {
      this.show = true
      this.formLoading = true
      this.select()
      this.isAdd = false
      this.uid = id
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
                message: '创建成功'
              })
              this.$parent.getData()
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
              this.$parent.getData()
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
    select() {
      if (!this.roles || this.roles.length === 0) {
        select().then(res => {
          this.roles = res
        })
      }
    }
  }
}
</script>
