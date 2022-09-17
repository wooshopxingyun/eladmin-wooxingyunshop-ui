import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopSysArticle',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopSysArticle/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopSysArticle',
    method: 'put',
    data
  })
}

export function query(data) {
  return request({
    url: 'api/wooshopSysArticle',
    method: 'get',
    params: data
  })
}

export default { add, edit, del, query }
