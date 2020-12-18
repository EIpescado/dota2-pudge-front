<template>
  <div class="app-container">
    <div v-if="userInfo">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="userInfo" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab" @tab-click="tabClick">
              <el-tab-pane label="个人信息" name="account">
                <account :user="userInfo" />
              </el-tab-pane>
              <el-tab-pane label="安全设置" name="security">
                <SecuritySetting />
              </el-tab-pane>
              <el-tab-pane label="操作日志" name="log">
                <UserLog ref="userLog" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import UserLog from './components/UserLog'
import Account from './components/Account'
import SecuritySetting from './components/SecuritySetting'
export default {
  name: 'Profile',
  components: { UserCard, UserLog, Account, SecuritySetting },
  data() {
    return {
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
  },
  methods: {
    tabClick(tab) {
      if (tab.name === 'log') {
        this.$refs.userLog.getUserLog()
      }
    }
  }
}
</script>
