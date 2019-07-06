import axios from '@/http/axios'

/*
 * 机构管理模块
 */

// 保存
export const saveDept = (data) => {
    return axios({
        url: '/Manage/sys/savedept',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/Manage/sys/deletedept',
        method: 'post',
        data
    })
}
// 查询机构树
export const findDeptTree = () => {
    return axios({
        url: '/Manage/sys/getdeptlist',
        method: 'get'
    })
}
