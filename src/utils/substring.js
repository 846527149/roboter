/**
 * 字符串截取相关操作
 */


//上传图片base字符串截取
export function StingBase64 (string) {
	const basestring=string.split("base64,")[1];
  return basestring;
}
