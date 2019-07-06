import axios from "@/http/axios";

/*
 * 角色管理模块
 */

// 保存
export const saveRole = data => {
  return axios({
    url: "/Manage/sys/saveRole",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/Manage/sys/deleterole",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "/Manage/sys/getrolespage",
    method: "post",
    data
  });
};
// 查询全部
export const findAll = () => {
  return axios({
    url: "/Manage/sys/getroleslist",
    method: "get"
  });
};
// 查询角色菜单集合
export const findRoleMenus = roleID => {
  return axios({
    url: "/Manage/sys/GetRolesMenu",
    method: "get",
    params: {'roleID':roleID}
  });
};
// 保存角色菜单集合
export const saveRoleMenus = data => {
  return axios({
    url: "/Manage/sys/createrolemenu",
    method: "post",
    data
  });
};
