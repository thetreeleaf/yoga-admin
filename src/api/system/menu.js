import request from '@/utils/request'

export function getMenuTableList(queryParams) {
  return request({
    url: '/system/sysMenu/table',
    method: 'get',
    params: queryParams
  })
}

export function getMenuSelectList() {
  return request({
    url: '/system/sysMenu/select',
    method: 'get'
  })
}

export function getMenuTreeSelectList() {
  return request({
    url: '/system/sysMenu/tree_select',
    method: 'get'
  })
}


export function getMenuRouteList() {
  return request({
    url: '/system/sysMenu/route',
    method: 'get'
  })
}


export function detail(id) {
  return request({
    url: '/system/sysMenu/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/system/sysMenu/',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/system/sysMenu/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/system/sysMenu/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/system/sysMenu/' + id,
    method: 'patch',
    data: data
  })
}

export function microServiceList() {
  return request({
    url: '/system/sysMenu/',
    method: 'get'
  })
}