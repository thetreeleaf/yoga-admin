import request from '@/utils/request';
/**
 * 获取会员卡列表
 *
 * @param queryParams
 */
export function listMemberCard(queryParams) {
    return request({
        url: '/member/membershipCard/list',
        method: 'get',
        params: queryParams
    });
}

export function add(data) {
    return request({
        url: '/member/membershipCard',
        method: 'post',
        data: data
    })
}

export function update(data) {
    return request({
        url: '/member/membershipCard',
        method: 'put',
        data: data
    })
}

export function del(ids) {
    return request({
        url: '/member/membershipCard/' + ids,
        method: 'delete',
    })
}