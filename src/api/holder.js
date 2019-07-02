import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/holder/list',
    method: 'get',
    params
  })
}

export function postCreate(data) {
  return request({
    url: '/holder/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/holder/update',
    method: 'post',
    data
  })
}

export function holderDelete(data) {
  return request({
    url: '/holder/delete',
    method: 'post',
    data
  })
}

export function holderSearch(params) {
  return request({
    url: '/holder/search',
    method: 'get',
    params
  })
}
