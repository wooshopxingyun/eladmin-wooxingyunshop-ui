import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopStoreProductPromise',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopStoreProductPromise/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopStoreProductPromise',
    method: 'put',
    data
  })
}

export function queryGetAll(data) {
  return request({
    url: 'api/wooshopStoreProductPromise',
    method: 'get',
    params: data
  })
}

export default { add, edit, del }
