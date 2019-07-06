import axios from "@/http/axios";

/*
 * 菜单管理模块
 */

// 保存
export const saveMenu = data => {
  return axios({
    url: "/Manage/sys/savemenu",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/Manage/sys/deletemenu",
    method: "post",
    data
  });
};
// 查找导航菜单树
export const findNavTree = userCode => {
  return axios({
    url: "/Manage/sys/GetUserMenuTree",
    method: "get",
    params: { userCode: userCode }
  });
};
// 查找导航菜单树
export const findMenuTree = () => {
  return axios({
    url: "/Manage/sys/GetMenuList",
    method: "get"
  });
};
// 查找导航目录菜单树
export const findCatelogMenuTree = () => {
  return axios({
    url: "/Manage/sys/GetCatelogMenuList",
    method: "get"
  });
};
// 获取菜单按钮
export const findMenuButton = menuId => {
  return axios({
    url: "/Manage/sys/getbutton4menu",
    method: "get",
    params: { menuId: menuId }
  });
}
// 保存菜单按钮
export const saveMenuButton = data => {
  return axios({
    url: "/Manage/sys/saveMenuButton",
    method: "post",
    data
  });
};
