import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wooshopUserBrokerageRecord',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooshopUserBrokerageRecord/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooshopUserBrokerageRecord',
    method: 'put',
    data
  })
}

export function query(data) {
  return request({
    url: 'api/wooshopUserBrokerageRecord',
    method: 'get',
    params: data
  })
}

/**
 * 获取分销订单记录
 * @param data
 * @returns {*}
 */

export function getBrokerageOrderRecords(data) {
  return request({
    url: 'api/wooshopUserBrokerageRecord/brokerageOrderRecords',
    method: 'get',
    params: data
  })
}

export default { add, edit, del, query }
