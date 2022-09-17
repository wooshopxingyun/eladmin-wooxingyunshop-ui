import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopStoreGoodsAttrDetails',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopStoreGoodsAttrDetails/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopStoreGoodsAttrDetails',
    method: 'put',
    data
  })
}

export function query(data) {
  return request({
    url: 'api/wooshopStoreGoodsAttrDetails',
    method: 'get',
    params: data
  })
}

export default { add, edit, del, query }
