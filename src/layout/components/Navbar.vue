<template>
  <div class="navbar">
    <!--折叠左侧菜单按钮-->
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!--右侧菜单 头像等-->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <el-tooltip :disabled="screenfullTooltipDisabled" content="全屏显示" effect="light" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" :baba="this" />
        </el-tooltip>

        <el-tooltip :disabled="sizeSelectTooltipDisabled" content="布局大小" effect="light" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" :baba="this" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="hover" :show-timeout="0" @visible-change="avatarContainerVisibleChange">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i :class="showAvatarContainerDropdown ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
        </div>
        <el-dropdown-menu slot="dropdown" class="navbar-dropdown-menu">
          <router-link to="/profile/index">
            <el-dropdown-item class="navbar-dropdown-item">
              <svg-icon icon-class="user" />
              个人中心
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/EIpescado/dota2-pudge-front">
            <el-dropdown-item class="navbar-dropdown-item">
              <svg-icon icon-class="link" />
              Github
            </el-dropdown-item>
          </a>
          <el-divider class="navbar-dropdown-divider" />
          <el-dropdown-item class="navbar-dropdown-item logout-dropdown-item" @click.native="open">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Hamburger,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      screenfullTooltipDisabled: false, sizeSelectTooltipDisabled: false, showAvatarContainerDropdown: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    async logout() {
      await this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    },
    closeToolTip(flag) {
      if (flag === 'screenfull') {
        this.screenfullTooltipDisabled = true
      } else if (flag === 'sizeSelect') {
        this.sizeSelectTooltipDisabled = true
      }
    },
    avatarContainerVisibleChange(val) {
      this.showAvatarContainerDropdown = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: $navbarBg;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 12px;
      height: 100%;
      font-size: 18px;
      color: $navbarText;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        // transition: background .3s;

        &:hover {
          background: $navbarHover;
        }
      }
    }

    .avatar-container {
      margin-right: 15px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

      }
    }
  }
}
.navbar-dropdown-menu{
  .navbar-dropdown-item{
    line-height: 32px;
    padding-left: 10px;
    padding-right: 44px;
  }
  .navbar-dropdown-divider{
    margin: 5px 0;
  }
  .logout-dropdown-item{
    margin-bottom: 5px;
  }
}
</style>
