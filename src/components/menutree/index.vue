<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="'' + menu.menuID">
    <template slot="title">
      <i :class="menu.menuImg"></i>
      <span slot="title">{{menu.menuName}}</span>
    </template>
    <MenuTree v-for="item in menu.children" :key="item.menuID" :menu="item"></MenuTree>
  </el-submenu>
  <el-menu-item v-else :index="'' + menu.menuID" @click="handleRoute(menu)">
    <i :class="menu.menuImg"></i>
    <span slot="title">{{menu.menuName}}</span>
  </el-menu-item>
</template>

<script>
import { getIFrameUrl, getIFramePath } from "@/utils/iframe";
export default {
  name: "MenuTree",
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleRoute(menu) {
      // 如果是嵌套页面，转换成iframe的path
      let path = getIFramePath(menu.navigateUrl);
      if (!path) {
        path = menu.navigateUrl;
      }
      // 通过菜单URL跳转至指定路由
      this.$router.push("/" + path);
    }
  }
};
</script>

<style scoped lang="scss">
.el-submenu,
.el-menu-item {
  i {
    color: #fff;
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
  }
}
.el-menu-item.is-active {
  color: #fff;
}
</style>
