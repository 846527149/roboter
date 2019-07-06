export default {
  state: {
    appName: "百诺汇一", // 应用名称
    themeColor: {
      // 主题颜色
      backgroudColor: "#304156",
      fontColor: "#fff",
      activeColor: "#f0f6ff"
    },
    tableTheme: {
      //表格样式
      size: "mini",
      border: true,
      stripe: true,
      align: "center",
      headerAlign: "center",
      limit: 10
    },
    oldThemeColor: "#14889A", // 上一次主题颜色
    collapse: false, // 导航栏收缩状态
    menuRouteLoaded: false // 菜单和路由是否已经加载
  },
  getters: {
    collapse(state) {
      // 对应着上面state
      return state.collapse;
    }
  },
  mutations: {
    onCollapse(state) {
      // 改变收缩状态
      state.collapse = !state.collapse;
    },
    setThemeColor(state, themeColor) {
      // 改变主题颜色
      state.oldThemeColor = state.themeColor;
      state.themeColor.backgroudColor = themeColor;
    },
    menuRouteLoaded(state, menuRouteLoaded) {
      // 改变菜单和路由的加载状态
      state.menuRouteLoaded = menuRouteLoaded;
    }
  },
  actions: {}
};
