import request from "@/utils/request";

/**
 * 登录
 * @param data
 */
export function login(data) {
    return request({
        url: '/oauth/token',
        method:'post',
        params: data,
        headers: {
            'Authorization': 'Basic eW9nYS1hZG1pbi13ZWI6MTIzNDU2' // 客户端信息Base64明文：yoga-admin-web:123456
        }
    })
}

/**
 * 注册
 * @param data
 */
 export function register(data) {
    return request({
        url: '/system/sysUser/regist',
        method:'post',
        data: data
    })
}

/**
 * 登录成功后获取用户信息（包括用户头像、权限列表等）
 */
export function getUserInfo() {
    return request({
        url: '/system/sysUser/me',
        method: 'get'
    })
}

/**
 * 
 * 注销
 */
export function logout() {
    return request({
        url: '/oauth/logout',
        method: 'delete'
    })
}

/**
 * 获取图片验证码
 */
export function getCaptcha() {
    return request({
        url: '/captcha?t='+(new Date()).getTime().toString(),
        method: 'get'
    })
}