module.exports = {
  title: 'Vue Element Admin',

  port: 9527,

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * 请求接口超时时间 默认30s
   */
  requestTimeOut: 30000,

  /**
   * 请求接口携带的请求header名称
   */
  requestTokenHeaderName: 'Authorization',

  /**
   * 请求凭证保存在浏览器cookie中的key值
   */
  tokenKey: 'DOTA2-PUDGE-TOKEN'
}
