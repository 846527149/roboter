import axios from '../axios'

/*
 * 系统登录模块
 */

// 登录
export const loginbyaccount = data => {
    return axios({
        url: '/api/Login/ByAccount/v1',
        method: 'post',
        data
    })
}
// 登录
export const login4phone = data => {
  return axios({
      url: '/Login/ByPhone/v1',
      method: 'post',
      data
  })
}
// 登出
export const logout = () => {
    return axios({
        url: '/Logout/Exit/v1',
        method: 'get'
    })
}
