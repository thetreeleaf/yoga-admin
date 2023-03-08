import request from '@/utils/request'

export function list(queryParams) {
  return request({
    url: '/system/sysUser/page',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/system/sysUser/' + id+'/form_detail',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/system/sysUser',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/system/sysUser/' + id,
    method: 'put',
    data: data
  })
}

export function updateUser(id, data) {
  return request({
    url: '/system/sysUser/update/user/' + id,
    method: 'put',
    data: data
  })
}

export function updatePassword(id, oldPassword,newPassword) {
  return request({
    url: '/system/sysUser/update/password/' + id,
    method: 'put',
    params: {
			oldPassword: oldPassword,
			newPassword: newPassword,
		},
  })
}

export function patch(id, data) {
  return request({
    url: '/system/sysUser/' + id,
    method: 'patch',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/system/sysUser/'+ids,
    method: 'delete',
  })
}

export function getUserProfile(id) {
  return request({
    url: '/system/sysUser/get/' + id,
    method: 'get'
  })
}

export function getUserNum() {
  return request({
    url: '/system/sysUser/num',
    method: 'get'
  })
}
