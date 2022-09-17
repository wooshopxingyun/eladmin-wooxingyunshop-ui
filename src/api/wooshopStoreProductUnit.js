import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopStoreProductUnit',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopStoreProductUnit/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopStoreProductUnit',
    method: 'put',
    data
  })
}

export function getAll(data) {
  return request({
    url: 'api/wooshopStoreProductUnit',
    method: 'get',
    params: data
  })
}

export default { add, edit, del }
