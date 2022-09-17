import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/sysUserGrade',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysUserGrade/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysUserGrade',
    method: 'put',
    data
  })
}

export function query(data) {
  return request({
    url: 'api/sysUserGrade',
    method: 'get',
    params: data
  })
}

export default { add, edit, del, query }
