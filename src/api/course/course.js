import request from '@/utils/request';
/**
 * 获取课程分页列表
 *
 * @param queryParams
 */
export function listCourseWithPage(queryParams) {
    return request({
        url: '/course/course/page',
        method: 'get',
        params: queryParams
    });
}

export function add(data) {
    return request({
        url: '/course/course',
        method: 'post',
        data: data
    })
}

export function update(id, data) {
    return request({
      url: '/course/course/' + id,
      method: 'put',
      data: data
    })
  }


export function del(ids) {
    return request({
        url: '/course/course/' + ids,
        method: 'delete',
    })
}