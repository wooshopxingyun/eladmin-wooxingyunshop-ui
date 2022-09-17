import request from '@/utils/request'

export function getHomeTatla() {
  return request({
    url: 'api/hometotal/index',
    method: 'get'
  })
}

export function getHomeMonthSales() {
  return request({
    url: 'api/hometotal/count/MonthSales',
    method: 'get'
  })
}

export function getHomeMonthOrderNum() {
  return request({
    url: 'api/hometotal/count/MonthOrderNum',
    method: 'get'
  })
}

export function getHomeClassification() {
  return request({
    url: 'api/hometotal/count/classification',
    method: 'get'
  })
}

export default {getHomeTatla, getHomeMonthSales, getHomeMonthOrderNum, getHomeClassification}
