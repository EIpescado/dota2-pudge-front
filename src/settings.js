module.exports = {
  /**
   * 页面title后缀
   */
  title: 'DOTA2',

  /**
   * 左上角系统名称
   */
  systemName: 'pudge后台管理',

  /**
   * 测试端口号
   */
  port: 9527,

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

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
  sidebarLogo: true,

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
  tokenKey: 'DOTA2-PUDGE-TOKEN',

  /**
   * 是否显示设置的底部信息
   */
  showFooter: true,
  /**
   * 底部文字，支持html语法
   */
  footerTxt: '©2020 <a href="#" target="_blank">yq from 1418-Group</a>',
  /**
   * 备案号
   */
  footerICP: '<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">粤ICP备123456789号</a>'
}
