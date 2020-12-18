<template>
  <div>
    <el-table size="medium" :show-header="false" :data="tableData">
      <el-table-column prop="label" width="150" />
      <el-table-column prop="description" />
      <el-table-column>
        <template slot-scope="{row}">
          <el-button type="primary" plain @click="change(row.flag)">更改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <UpdatePass ref="passwordForm" />
    <UpdateMail ref="mailForm" />
    <UpdatePhone ref="phoneForm" />
  </div>
</template>

<script>
import UpdatePass from './UpdatePass'
import UpdateMail from './UpdateMail'
import UpdatePhone from './UpdatePhone'
export default {
  components: { UpdatePass, UpdateMail, UpdatePhone },
  data() {
    return {
      tableData: [],
      userForm: { nickname: '' }, submitLoading: false, submitDisabled: false,
      rules: {
        nickname: [
          { required: true, message: '昵称必填', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    change(flag) {
      switch (flag) {
        case 'mail':
          this.$refs.mailForm.dialog = true
          break
        case 'phone':
          this.$refs.phoneForm.dialog = true
          break
        case 'password':
          this.$refs.passwordForm.dialog = true
          break
      }
    },
    getData() {
      const userInfo = this.$store.getters.userInfo
      this.tableData = [
        { label: '更改邮箱', description: ('您当前的邮箱是 ' + userInfo.mail), flag: 'mail' },
        { label: '换绑手机', description: ('您当前的手机号码是 ' + userInfo.phone), flag: 'phone' },
        { label: '更改密码', description: '建议您90天更改一次密码', flag: 'password' }
      ]
    }
  }
}
</script>
