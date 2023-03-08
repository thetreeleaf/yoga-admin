import request from '@/utils/request'

export function getRolePageList(queryParams) {
  return request({
    url: '/system/sysRole/page',
    method: 'get',
    params: queryParams
  })
}

export function getRoleList() {
  return request({
    url: '/system/sysRole',
    method: 'get',
  })
}

export function detail(id) {
  return request({
    url: '/system/sysRole/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/system/sysRole',
    method: 'post',
    data: data
  })
}

export function update(id, data) {
  return request({
    url: '/system/sysRole/' + id,
    method: 'put',
    data: data
  })
}

export function del(ids) {
  return request({
    url: '/system/sysRole/' + ids,
    method: 'delete'
  })
}

export function patch(id, data) {
  return request({
    url: '/system/sysRole/' + id,
    method: 'patch',
    data: data
  })
}


export function listRoleMenu(id) {
  return request({
    url: '/system/sysRole/' + id + '/menu_ids',
    method: 'get'
  })
}


export function listRolePermission(roleId, params) {
  return request({
    url: '/system/sysRole/' + roleId + '/permissions',
    method: 'get',
    params: params
  })
}

export function updateRoleMenu(id, menuIds) {
  return request({
    url: '/system/sysRole/' + id + '/menus',
    method: 'put',
    data: {menuIds: menuIds}
  })
}

export function updateRolePermission(menuId, roleId, permissionIds) {
  return request({
    url: '/system/sysRole/' + roleId + '/permissions',
    method: 'put',
    data: {menuId: menuId, permIds: permissionIds}
  })
}

export function getRoleNum() {
  return request({
    url: '/system/sysRole/num',
    method: 'get'
  })
}
