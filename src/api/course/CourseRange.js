import request from '@/utils/request'



export function getCourseRangeDetail(id) {
  return request({
    url: '/course/courseRange/' + id,
    method: 'get'
  })
}

export function add(data) {
    return request({
        url: '/course/courseRange',
        method: 'post',
        data: data
    })
}

export function update(id, data) {
    return request({
      url: '/course/courseRange/' + id,
      method: 'put',
      data: data
    })
  }