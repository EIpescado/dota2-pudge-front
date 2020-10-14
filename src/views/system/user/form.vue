<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="show" :title="isAdd ? '新增用户' : '编辑用户'" @closed="cancel">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" class="form-container">
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
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { create, update, get } from '@/api/system/user'
import { select } from '@/api/system/role'
export default {
  name: 'UserForm',
  data() {
    return {
      form: { username: '', nickname: '', phone: '', roleIds: [] },
      rules: {
        username: [
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称必填', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机必填', trigger: 'blur' }
        ],
        roleIds: [
          { required: true, message: '角色必选', trigger: 'blur' }
        ]
      },
      show: false, isAdd: false, roles: [], uid: ''
    }
  },
  created() {
  },
  methods: {
    createOpen() {
      this.select()
      this.isAdd = true
      this.show = true
    },
    updateOpen(id) {
      this.select()
      this.isAdd = false
      this.uid = id
      get(id).then(res => {
        this.form = res
        this.show = true
      })
    },
    cancel() {
      this.show = false
      this.$refs.form.resetFields()
    },
    submit() {
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
