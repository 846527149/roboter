import axios from "@/http/axios";

/*
 * 系统按钮
 */

// 保存
export const save = data => {
  return axios({
    url: "/Manage/sys/savebutton",
    method: "post",
    data
  });
};
// 删除
export const batchDelete = data => {
  return axios({
    url: "/Manage/sys/deletebutton",
    method: "post",
    data
  });
};
// 分页查询
export const findPage = data => {
  return axios({
    url: "/Manage/sys/getbuttonpage",
    method: "post",
    data
  });
};
// 集合查询
export const findList = data => {
  return axios({
    url: "/Manage/sys/getbuttonlist",
    method: "post",
    params:{"filter":data}
  });
};
export const findPageButtonList = data => {
  return axios({
    url: "/Manage/sys/getpagebuttonlist",
    method: "get",
    params:{"pageUrl":data.path,"userID":data.userID}
  });
};
