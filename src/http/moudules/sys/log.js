import axios from '@/http/axios'

/*
 * 日志管理模块
 */

// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/Manage/log/findPage',
        method: 'post',
        data
    })
}
