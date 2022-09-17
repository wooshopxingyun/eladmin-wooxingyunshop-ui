import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopSysCity',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopSysCity/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopSysCity',
    method: 'put',
    data
  })
}

/**
 * 获取树形结构行政区域
 * @returns {*} 树形结构
 */
export function getCityTree() {
  return request({
    url: 'api/wooshopSysCity/gettree',
    method: 'get'
  })
}

export default { add, edit, del }
