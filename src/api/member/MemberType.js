import request from '@/utils/request';
/**
 * 获取会员分页列表
 *
 * @param queryParams
 */
export function listMemberTypeWithPage(queryParams) {
    return request({
        url: '/member/memberType/page',
        method: 'get',
        params: queryParams
    });
}

export function update(data) {
    return request({
        url: '/member/memberType',
        method: 'put',
        data: data
    })
}