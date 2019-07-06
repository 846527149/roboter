import axios from "@/http/axios";

/*
 * 用户管理模块
 */
export const getUser = userCode => {
  return axios({
    url: "/Manage/sys/getUser",
    method: "get",
    params: { userCode: userCode }
  });
};
// 保存
export const save = data => {
  return axios({
    url: "/Manage/sys/SaveUser",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/Manage/sys/deleteuser",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "/Manage/sys/GetUserPage",
    method: "post",
    data
  });
};
// 查找用户的菜单权限标识集合
export const findPermissions = userCode => {
  return axios({
    url: "/Manage/sys/GetUserPermissions",
    method: "get",
    params: { userCode: userCode }
  });
};
