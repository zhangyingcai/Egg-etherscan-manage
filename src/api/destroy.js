import request from '@/utils/request'

export function getList(params){
  return request({
    url: '/destroy/list',
    method: 'get',
    params
  })
}

export function postCreate(data){
  return request({
    url: '/destroy/create',
    method: 'post',
    data
  })
}

export function update(data){
  return request({
    url: '/destroy/update',
    method: 'post',
    data
  })
}

export function destroyDelete(data){
  return request({
    url: '/destroy/delete',
    method: 'post',
    data
  })
}
