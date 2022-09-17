import request from '@/utils/request'
// import {add, query} from "./wooshopWithdrawRecord";

export function add(data) {
  return request({
    url: 'api/wooSysConfig',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wooSysConfig/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/wooSysConfig',
    method: 'put',
    data
  })
}


export function WeiXinPaySys(data) {
  return request({
    url: 'api/wooSysConfig/weixinpaysys',
    method: 'POST',
    data
  })
}

export function querySysConfig(data) {
  return request({
    url: 'api/wooSysConfig',
    method: 'get',
    params: data
  })
}

export function getAliyunSms(data) {
  return request({
    url: 'api/wooSysConfig/aliyunsms',
    method: 'post',
    data
  })
}

/**
 * 查配置
 * @param menuname
 * @returns {*}
 */
export function querySysconfig(menuname) {
  /*//post请求写法 后端接收使用(@RequestBody String menuname)*/
  return request({
    url: 'api/wooSysConfig/queryaliyunsms',
    method: 'POST',
    data: menuname
  })
}


export function querySysconfigweixinMP(menuname) {
  return request({
    url: 'api/wooSysConfig/querWeixinMP',
    method: 'POST',
    data: menuname
  })
}

export function getweixinMPConfig(data) {
  return request({
    url: 'api/wooSysConfig/getweixinMPConfig',
    method: 'post',
    data
  })
}

export default { add, edit, del }
