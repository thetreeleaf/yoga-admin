import request from '@/utils/request'


export function add(data) {
  return request({
    url: '/system/coach',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/system/coach',
    method: 'put',
    data: data
  })
}

export function getCoachPageList(queryParams) {
  return request({
    url: '/system/coach/page',
    method: 'get',
    params: queryParams
  })
}

export function getCoachList(id) {
  return request({
    url: '/system/coach/list/' + id,
    method: 'get'
  })
}