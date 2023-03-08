import {login, logout, getUserInfo} from '@/api/login'
import {getToken, setToken, removeToken, setRefreshToken, removeRefreshToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  perms: [],
  placeId: 0,
  userId: 0,
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  },
  SET_PLACEID: (state, placeId) => {
    state.placeId = placeId
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
login({commit}, userInfo) {
  const {username, password, code, uuid} = userInfo
  return new Promise((resolve, reject) => {
    login({
      username: username,
      password: password,
      grant_type: 'captcha',
      uuid: uuid,
      code: code
    }).then(response => {
      const {access_token, refresh_token, token_type} = response.data
      const token = token_type + " " + access_token
      commit('SET_TOKEN', token)
      setToken(token)
      setRefreshToken(refresh_token)
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
  },
  refreshToken({commit}, refreshToken) {
    commit('SET_TOKEN', undefined)
    return new Promise((resolve, reject) => {
      login({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).then(response => {
        const {access_token, token_type} = response.data
        const token = token_type + " " + access_token
        commit('SET_TOKEN', token)
        setToken(token)
        resolve(token)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getUserInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const {data} = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {roles, nickname, avatar, perms,placeId,userId} = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getUserInfo: roles must be a non-null array!')
        }
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_PERMS', perms)
        commit('SET_PLACEID',placeId)
        commit('SET_USERID',userId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NICKNAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLES', [])
        commit('SET_PERMS', [])
        commit('SET_PLACEID',0)
        commit('SET_USERID',0)
        removeToken()
        removeRefreshToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/hxrui/issues/2485
        dispatch('tagsView/delAllViews', null, {root: true})

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMS', [])
      removeToken()
      removeRefreshToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({commit, dispatch}, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {roles} = await dispatch('getUserInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {root: true})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
