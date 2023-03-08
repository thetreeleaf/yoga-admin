import request from '@/utils/request'

export function getPlaceList() {
  return request({
    url: '/system/place/list',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/system/place',
    method: 'post',
    data: data
  })
}

export function getPlaceDetail(id) {
  return request({
    url: '/system/place/' + id + '/detail',
    method: 'get'
  })
}


export function update(id, data) {
  return request({
    url: '/system/place/' + id,
    method: 'put',
    data: data
  })
}

export function getPlacePageList(queryParams) {
  return request({
    url: '/system/place/page',
    method: 'get',
    params: queryParams
  })
}

export function uploadImg(data) {
  return request({
    url: '/system/place/uploadImg',
    method: 'post',
    data: data
  })
}

export function getPlaceNum() {
  return request({
    url: '/system/place/num',
    method: 'get'
  })
}
