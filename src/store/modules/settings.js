import defaultSettings from '@/settings'
import Cookies from 'js-cookie'

const { showSettings, tagsView, fixedHeader, sidebarLogo, showFooter, footerTxt, footerICP, themeColor } = defaultSettings

const theme = Cookies.get('theme') ? Cookies.get('theme') : themeColor

const state = {
  theme: theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  showFooter: showFooter,
  footerTxt: footerTxt,
  footerICP: footerICP
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      if (key === 'theme') {
        Cookies.set(key, value)
      }
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

