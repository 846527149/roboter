<template>
  <el-form
    :model="loginForm"
    :rules="fieldRules"
    ref="loginForm"
    label-position="left"
    label-width="0px"
    class="demo-ruleForm login-container"
  >
    <span class="tool-bar">
      <!-- 语言切换 -->
      <!-- <lang-selector class="lang-selector"></lang-selector>    -->
    </span>
    <h2 class="title" style="padding-left:22px;">康复机器人云平台登录</h2>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button style="width:48%;" @click.native.prevent="reset">重 置</el-button>
      <el-button
        type="primary"
        style="width:48%;"
        @click.native.prevent="login"
        :loading="loading"
      >登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";
import axios from "axios";
import ThemePicker from "@/components/themepicker";
import LangSelector from "@/components/langselector";
export default {
  name: "Login",
  components: {
    ThemePicker,
    LangSelector
  },
  data() {
    return {
      loading: false,
      loginForm: {
        account: "admin",
        password: "abcd1234!",
        captcha: "",
        src: ""
      },
      fieldRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  methods: {
    login() {
      this.loading = true;
      let userInfo = {
        account: this.loginForm.account,
        password: this.loginForm.password
      };
      this.$api.login
        .loginbyaccount(userInfo)
        .then(res => {
          console.log(res)
          Cookies.set("ekToken", res.token); // 放置token到Cookie
          sessionStorage.setItem("user", res.userCode); // 保存用户到本地会话
          this.$store.state.tab.mainTabs = [];
          this.$store.commit("menuRouteLoaded", false); // 要求重新加载导航菜单
          this.$router.push("/"); // 登录成功，跳转到主页
        })
        .finally(res => {
          this.loading = false;
        });
    },
    refreshCaptcha: function() {
      this.loginForm.src =
        this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
    },
    reset() {
      this.$refs.loginForm.resetFields();
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit("setThemeColor", themeColor);
    }
  },
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  },
  mounted() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#304156");
    this.refreshCaptcha();
  },
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor
    })
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  margin: auto;
  position: absolute;
  top: -100px;
  left: 0;
  bottom: 0;
  right: 0;
  height: 260px;
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
