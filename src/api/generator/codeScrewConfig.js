import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/codeScrewConfig/query',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: 'api/codeScrewConfig',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/codeScrewConfig/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/codeScrewConfig',
    method: 'put',
    data
  })
}

export function download(fileType, type) {
  return request({
    url: 'api/codeScrewConfig/download?fileType=' + fileType,
    method: 'post',
    responseType: type === 2 ? 'blob' : ''
  })
}
export default { add, edit, del }
