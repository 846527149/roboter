<template>
  <div class="personal-panel">
    <div class="personal-desc" :style="{'background':this.$store.state.app.themeColor.backgroudColor}">
      <div class="avatar-container">
        <img class="avatar" :src="require('@/assets/user.png')" />
      </div>
      <div class="name-role">
        <span class="sender">{{ user.name }} - {{ user.rolesName }}</span>
      </div>
    </div>
    <div class="main-operation">
      <span class="main-operation-item">
        <el-button size="small" icon="icon icon-yuangong"> 个人中心</el-button>
      </span>
      <span class="main-operation-item">
        <el-button size="small" icon="icon icon-mima"> 修改密码</el-button>
      </span>
    </div>
    <div class="other-operation">
      <div class="other-operation-item">
        <li class="icon icon-qinglihuancun"></li>
        清除缓存
      </div>
    </div>
    <div class="personal-footer" @click="logout">
      <i class="icon icon-tuichu"/>
      {{$t("common.logout")}}
    </div>
  </div>
</template>

<script>
export default {
  name: "personalpanel",
  components: {},
  props: {
    user: {
      type: Object,
      default: {
        name: "",
        avatar: "@/assets/user.png",
        role: ""
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    // 退出登录
    logout: function() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("user");
          this.$router.push("/login");
          this.$api.login
            .logout()
            .then(res => {})
            .catch(function(res) {});
        })
        .catch(() => {});
    },
    // 打开备份还原界面
    showBackupDialog: function() {
      this.$refs.backupDialog.setBackupVisible(true);
    },
    // 成功还原之后，重新登录
    afterRestore: function() {
      this.$refs.backupDialog.setBackupVisible(false);
      sessionStorage.removeItem("user");
      this.$router.push("/login");
      this.$api.login
        .logout()
        .then(res => {})
        .catch(function(res) {});
    }
  },
  mounted() {}
};
</script>

<style scoped>
.personal-panel {
  font-size: 14px;
  width: 280px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-width: 1px;
  border-style: solid;
  background: rgba(182, 172, 172, 0.1);
  margin: -14px;
}
.personal-desc {
  padding: 15px;
  color: #fff;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 90px;
}
.name-role {
  font-size: 16px;
  padding: 5px;
}
.personal-relation {
  font-size: 16px;
  padding: 12px;
  margin-right: 1px;
  background: rgba(200, 209, 204, 0.3);
}
.relation-item {
  padding: 12px;
}
.relation-item:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
}
.main-operation {
  padding: 8px;
  margin-right: 1px;
  /* background: rgba(175, 182, 179, 0.3); */
  border-color: rgba(201, 206, 206, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.main-operation-item {
  margin: 15px;
}
.other-operation {
  padding: 15px;
  margin-right: 1px;
  text-align: left;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.other-operation-item {
  padding: 12px;
}
 li {
  float: left;
}
.other-operation-item:hover {
  cursor: pointer;
  background: #9e94941e;
  color: rgb(19, 138, 156);
}
.personal-footer {
  margin-right: 1px;
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.personal-footer:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
  background: #b1a6a61e;
}
</style>
