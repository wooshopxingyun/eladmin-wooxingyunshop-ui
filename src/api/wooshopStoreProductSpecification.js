import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopStoreProductSpecification',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopStoreProductSpecification/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopStoreProductSpecification',
    method: 'put',
    data
  })
}

/**
 * 查询商品规格
 * @param data
 * @returns {*}
 */
export function queryGet(data) {
  return request({
    url: 'api/wooshopStoreProductSpecification',
    method: 'get',
    params: data
  })
}

export default { add, edit, del }
