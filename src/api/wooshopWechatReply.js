import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopWechatReply',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopWechatReply/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopWechatReply',
    method: 'put',
    data
  })
}

export function query(data) {
  return request({
    url: 'api/wooshopWechatReply',
    method: 'get',
    params: data
  })
}

export default { add, edit, del, query }
