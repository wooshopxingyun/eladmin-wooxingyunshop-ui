import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopStoreGoodsSuk',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopStoreGoodsSuk/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopStoreGoodsSuk',
    method: 'put',
    data
  })
}

export function query(data) {
  return request({
    url: 'api/wooshopStoreGoodsSuk',
    method: 'get',
    params: data
  })
}

export default { add, edit, del, query }
