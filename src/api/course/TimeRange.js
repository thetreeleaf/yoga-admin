import request from '@/utils/request'



export function getTimeRangeList() {
  return request({
    url: '/course/timeRange/list',
    method: 'get'
  })
}