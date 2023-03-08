import request from '@/utils/request'

export function getPermissionPageList(queryParams) {
  return request({
    url: '/system/sysPermission/page',
    method: 'get',
    params: queryParams
  })
}


export function getPermissionList(queryParams) {
  return request({
    url: '/system/sysPermission',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/system/sysPermission/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/system/sysPermission/',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/system/sysPermission/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/system/sysPermission/'+ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/system/sysPermission/' + id,
    method: 'patch',
    data: data
  })
}
