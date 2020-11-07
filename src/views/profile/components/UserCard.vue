<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <el-avatar shape="square" :size="100" fit="fit" :src="user.avatar" />
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.nickname }}</div>
        <div class="user-role text-center text-muted">普通用户</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="user" /><span>个人信息</span></div>
        <div class="user-bio-section-body">
          <ul class="user-info">
            <li><svg-icon icon-class="user" /> 登录账号<div class="user-right">{{ user.username }}</div></li>
            <li><svg-icon icon-class="phone" /> 手机号码 <div class="user-right">{{ user.phone }}</div></li>
            <li>
              <svg-icon icon-class="panda" /> 安全设置
              <div class="user-right">
                <a @click="$refs.pass.dialog = true">修改密码</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .user-info {
      padding-left: 0;
      list-style: none;
      li{
        border-bottom: 1px solid #F0F3F4;
        padding: 11px 0;
        font-size: 13px;
      }
      .user-right {
        float: right;
        color: #777;
        a{
          color: #317EF3;
        }
      }
    }
  }
}
</style>
