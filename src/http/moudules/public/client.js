import axios from "@/http/axios";

//获取显示端列表
export function GetClient() {
	return axios({
		url: '/Manage/Article/GetClient',
		method: 'get'
	})
}

