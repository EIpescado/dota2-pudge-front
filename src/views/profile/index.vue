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
              <el-tab-pane label="帐号信息" name="account">
                <account :user="userInfo" />
              </el-tab-pane>
              <el-tab-pane label="操作日志" name="timeline">
                <timeline ref="timeline" />
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
import Timeline from './components/Timeline'
import Account from './components/Account'
export default {
  name: 'Profile',
  components: { UserCard, Timeline, Account },
  data() {
    return {
      user: {}, activeTab: 'account'
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
      if (tab.name === 'timeline') {
        this.$refs.timeline.getUserLog()
      }
    }
  }
}
</script>
