import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopFreightTemplate',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopFreightTemplate/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopFreightTemplate',
    method: 'put',
    data
  })
}

/**
 *  条件查询
 * @param data{ sortZ:排序,isStart:1是 0否启用}
 * @returns {*}
 */
export function queryGet(data) {
  return request({
    url: 'api/wooshopFreightTemplate',
    method: 'get',
    params: data
  })
}

export default { add, edit, del }
