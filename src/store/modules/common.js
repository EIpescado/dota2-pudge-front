import { select } from '@/api/system/dict'

const state = {
  system_notice_type: [],
  system_log_type: [],
  system_file_tag: [],
  system_user_state: []
}

const mutations = {
  DICT_SELECT: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  GetDictByDictType({ commit }, dictType) {
    return new Promise((resolve, reject) => {
      select(dictType).then(res => {
        commit('DICT_SELECT', { key: dictType, value: res })
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
