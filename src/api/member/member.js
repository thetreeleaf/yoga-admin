import request from '@/utils/request';
/**
 * 获取会员分页列表
 *
 * @param queryParams
 */
export function listMembersWithPage(queryParams) {
    return request({
        url: '/member/member/page',
        method: 'get',
        params: queryParams
    });
}

export function getMemberNum() {
    return request({
      url: '/member/member/num',
      method: 'get'
    })
  }