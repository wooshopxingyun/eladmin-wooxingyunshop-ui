import request from '@/utils/request'
import {encrypt} from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/users',
    method: 'put',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'api/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

/**
 * 获取会员信息详情
 * @param userId
 * @returns {*}
 */

export function getMemberInfo(userId) {
  return request({
    url: 'api/users/getMemberInfo/' + userId,
    method: 'get',
    // data
  })
}

/**
 * 获取好友关系
 * @param userId
 * @returns {*}
 */

export function getUserFriends(userId) {
  return request({
    url: 'api/users/getUserFriends/' + userId,
    method: 'get',
    // data
  })
}

/**
 * 更新积分/余额
 * @param data
 * @returns {*}
 */
export function updateIntegralMoney(data) {
  return request({
    url: 'api/users/updateIntegralMoney',
    method: 'post',
    data
  })
}
/**
 * 更新用户等级
 * @param data
 * @returns {*}
 */
export function updateUserLevel(data) {
  return request({
    url: 'api/users/updateUserLevel',
    method: 'get',
    params: data
  })
}

export default {add, edit, del}

