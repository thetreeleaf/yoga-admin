import request from '@/utils/request'



export function getRoomList(id) {
  return request({
    url: '/course/room/list',
    method: 'get',
  })
}