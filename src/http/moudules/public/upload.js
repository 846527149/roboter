import axios from "@/http/axios";

//上传图片
export function UploadImgByBase64(baseStr,imgtype) {
	return axios({
		url: '/File/UploadImgByBase64',
		method: 'post',
    data: {
    	baseStr:baseStr,      
    	imgtype:imgtype			//海报图片= 1,新闻图片= 2,身份证图片及个人头像= 3,设备图片= 4,报告文件= 5
    }
	})
}

