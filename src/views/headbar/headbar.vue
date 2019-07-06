<template>
  <div class="headbar" :style="{'background':themeColor.backgroudColor}" :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu class="el-menu-demo" :background-color="themeColor.backgroudColor" :text-color="themeColor.fontColor" :active-text-color="themeColor.fontColor" mode="horizontal">
        <el-menu-item index="1" @click="onCollapse">
          <hamburger :isActive="collapse"></hamburger>
        </el-menu-item>
      </el-menu>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" :background-color="themeColor.backgroudColor" :text-color="themeColor.fontColor" :active-text-color="themeColor.fontColor" mode="horizontal" @select="selectNavBar()">
        <el-menu-item index="2" @click="openWindow('https://eeejian.com/')">{{$t("common.wwwurl")}}</el-menu-item>
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="right">
      <el-menu class="el-menu-demo" :background-color="themeColor.backgroudColor" :text-color="themeColor.backgroudColor" :active-text-color="themeColor.backgroudColor" mode="horizontal">
        <el-menu-item index="1">
          <!-- 主题切换 -->
          <theme-picker class="theme-picker" size="mini"  :default="themeColor.backgroudColor" @onThemeChange="onThemeChange"></theme-picker>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar" />{{user.name}}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="user"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mock from "@/mock/index";
import Hamburger from "@/components/hamburger";
import ThemePicker from "@/components/themepicker";
import LangSelector from "@/components/langselector";
import Action from "@/components/toolbar/action";
import NoticePanel from "@/views/core/noticepanel";
import MessagePanel from "@/views/core/messagepanel";
import PersonalPanel from "@/views/core/personalpanel";
export default {
  components: {
    Hamburger,
    ThemePicker,
    LangSelector,
    Action,
    NoticePanel,
    MessagePanel,
    PersonalPanel
  },
  data() {
    return {
      user: {
        name: "",
        avatar: "",
        rolesName: ""
      },
      activeIndex: "1",
      langVisible: false
    };
  },
  methods: {
    openWindow(url) {
      window.open(url);
    },
    // 折叠导航栏
    onCollapse: function() {
      this.$store.commit("onCollapse");
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit("setThemeColor", themeColor);
    },
    // 语言切换
    changeLanguage(lang) {
      lang === "" ? "zh_cn" : lang;
      this.$i18n.locale = lang;
      this.langVisible = false;
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      this.$api.sys_user.getUser(user).then(res => {
        this.user.name = res.operatorName;
        this.user.rolesName = res.rolesName;
        this.user.avatar = require("@/assets/user.png");
      });
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor,
      collapse: state => state.app.collapse
    })
  }
};
</script>

<style scoped lang="scss">
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  line-height: 60px;
}
.el-menu-item.is-active {
  border-bottom: none;
}
.hamburg,
.navbar {
  float: left;
}
.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
}
.badge {
  line-height: 18px;
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}
</style>
