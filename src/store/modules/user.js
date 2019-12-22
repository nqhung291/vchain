import { login } from '@/api/user'
import { getToken, setToken, removeToken, setName, removeName, getName } from '@/utils/auth'

const state = {
  token: getToken(),
  name: getName(),
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response
        commit('SET_TOKEN', data.authorization)
        commit('SET_ROLES', data.role)
        commit('SET_NAME', userInfo.username)
        setToken(data.authorization)
        setName(userInfo.username)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '')
      removeToken()
      removeName()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
