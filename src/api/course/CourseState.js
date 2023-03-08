import request from '@/utils/request';

export function listCourseStateWithPage(queryParams) {
    return request({
        url: '/course/courseState/page',
        method: 'get',
        params: queryParams
    });
}

export function update(ids, state) {
    return request({
      url: '/course/courseState/' + ids,
      method: 'put',
      params: {
          state: state
      }
    })
  }


export function del(id) {
    return request({
        url: '/course/courseState/' + id,
        method: 'delete',
    })
}