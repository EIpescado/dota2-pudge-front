/**
 * 用户名校验 字母开头，允许2-18字节，允许字母数字下划线
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{1,17}$/
  return reg.test(str)
}

/**
 * 密码校验 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
 * @param {string} str
 * @returns {Boolean}
 */
export function validPassword(str) {
  const reg = /^[a-zA-Z]\w{5,17}$/
  return reg.test(str)
}

/**
 * 昵称校验 2-18位中文,字母,数字及下划线
 * @param {string} str
 * @returns {Boolean}
 */
export function validNickname(str) {
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,18}$/
  return reg.test(str)
}

/**
 * 姓名校验 中文名, 可为 阿迷·尼玛
 * @param {string} name
 * @returns {Boolean}
 */
export function validName(name) {
  const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
  return reg.test(name)
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
  const reg = /^1[2345789]\d{9}$/
  return reg.test(phone)
}
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 创建校验器用于表单校验
 * @param {*} value  值
 * @param {*} notNull 是否可null
 * @param {*} validateFun 有值的校验函数
 * @param {*} validateNotPassMsg 校验不通过的提示
 * @param {*} callback 回调
 * @param {*} nullMsag 不可为空时,值为空的提示
 */
export function createValidator(notNull, validateFun, validateNotPassMsg, nullMsag) {
  return (rule, value, callback) => {
    const isNull = !value || (isArray(value) && value.length === 0)
    if (notNull) {
      // 不可为空 但是值为空
      if (isNull) {
        callback(new Error(nullMsag))
      } else {
        if (!validateFun(value)) {
          callback(new Error(validateNotPassMsg))
        } else {
          callback()
        }
      }
    } else {
      if (isNull) {
        callback()
      } else {
        if (!validateFun(value)) {
          callback(new Error(validateNotPassMsg))
        } else {
          callback()
        }
      }
    }
  }
}

/**
 * 必填
 * @param {*} tip 提示
 */
export function createRequiredValidator(tip) {
  return (rule, value, callback) => {
    const isNull = !value || (isArray(value) && value.length === 0)
    if (isNull) {
      callback(new Error(tip))
    } else {
      callback()
    }
  }
}

