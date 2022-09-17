import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopConfigCategory',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopConfigCategory/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopConfigCategory',
    method: 'put',
    data
  })
}

/**
 * 查询系统分类
 * @param data
 * @returns {*}
 */
export function queryGet(data) {
  return request({
    url: 'api/wooshopConfigCategory',
    method: 'get',
    params: data
  })
}

/**
 * 获取分类表信息
 * @param data
 * @returns {*}
 */
export function getimgcategory(data) {
  return request({
    url: 'api/wooshopConfigCategory/getimgcategory',
    method: 'get',
    params: data
  })
}

/**
 * 获取图片分类表信息
 * @param data
 * @returns {*}
 */
export function byCategoryGetAllImg(data) {
  return request({
    url: 'api/wooshopConfigCategory/getimgcategory/bycategoryall',
    method: 'get',
    params: data
  })
}

/**
 * 新增分类
 * @param data
 * @returns {*}
 */
export function addCategoryinfo(data) {
  return request({
    url: 'api/wooshopConfigCategory/addcategory',
    method: 'get',
    params: data
  })
}

export default { add, edit, del }
