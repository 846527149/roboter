import axios from "@/http/axios";

// 添加
export const CreateCustomer = data => {
  return axios({
    url: "/Manage/Customer/CreateCustomer",
    method: "post",
    data
  });
};

// 修改
export const UpdateCustomer = data => {
  return axios({
    url: "/Manage/Customer/UpdateCustomer",
    method: "post",
    data
  });
};

// 删除
export const batchDelete = data => {
  return axios({
    url: "/Manage/Customer/DeleteCustomer",
    method: "post",
    data
  });
};

//重置密码
export const ResetPassword = data => {
  return axios({
    url: "/Manage/Customer/ResetPassword",
    method: "post",
    data
  });
};

// 分页查询
export const findPage = data => {
  return axios({
    url: "/Manage/Customer/GetPageList",
    method: "post",
    data
  });
};

// 会员等级
export function GetUserType() {
	return axios({
		url: '/Manage/Customer/UserType',
		method: 'get',
    params: ''
	})
}

// 金银卡字典
export function GetUserCardType() {
	return axios({
		url: '/Manage/Customer/GetUserCardType',
		method: 'get',
    params: ''
	})
}

// 客户来源
export function GetUserSourceType() {
	return axios({
		url: '/Manage/Customer/GetUserSourceType',
		method: 'get',
    params: ''
	})
}