import request from '@/utils/request'



export function PlaceCourseTable(id, data) {
    return request({
        url: '/course/courseDetail/' + id + '/table/' + data,
        method: 'get',
    })
}

export function updateCourseDetail(id, data) {
    return request({
        url: '/course/courseDetail/' + id,
        method: 'put',
        data: data
    })
}

export function deleteCourseDetail(id) {
    return request({
        url: '/course/courseDetail/' + id,
        method: 'delete',
    })
}
