const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userInfo: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routes: state => state.permission.routes,
  dictSelectData: state => state.common
}
export default getters
