/* eslint-disable */
// 时间所属日期的 开始时间
Date.prototype.toMidnight = function() {
  this.setHours(0)
  this.setMinutes(0)
  this.setSeconds(0)
  this.setMilliseconds(0)
  return this
}

// 几天前的 开始时间
Date.prototype.daysAgo = function(days, midnight) {
  days = days ? days - 0 : 0
  const date = new Date(this.getTime() - days * 8.64E7)
  return midnight ? date.toMidnight() : date
}

// 本月的开始时间
Date.prototype.monthBegin = function(offset) {
  offset = offset ? offset - 0 : 0
  const days = this.getDate() - 1 - offset
  return this.daysAgo(days, true)
}

// 本季度的开始时间
Date.prototype.quarterBegin = function() {
  const month = this.getMonth() - this.getMonth() % 3
  return new Date(this.getFullYear(), month, 1).toMidnight()
}

Date.prototype.yearBegin = function() {
  return new Date(this.getFullYear(), 0, 1).toMidnight()
}

// 格式化日期
Date.prototype.strftime = function(format) {
  if (!format) {
    const str = new Date(this.getTime() + 2.88E7).toISOString()
    return str.substr(0, 19).replace('T', ' ')
  }
  local = 'zh'
  const padZero = function(str, len) {
    const pads = len - str.toString().length
    return (pads && pads > 0 ? '0'.repeat(pads) : '') + str
  }
  format = format.replace('%F', '%Y-%m-%d')
  format = format.replace(/%D|%x/, '%m/%d/%y')
  format = format.replace(/%T|%X/, '%H:%M:%S')
  format = format.replace('%R', '%H:%M')
  format = format.replace('%r', '%H:%M:%S %p')
  format = format.replace('%c', '%a %b %e %H:%M:%S %Y')
  const _this = this
  return format.replace(/%[A-Za-z%]/g, function(f) {
    let ans = f
    switch (f) {
      case '%%':
        ans = '%'
        break

      case '%Y':
      case '%G':
        ans = _this.getFullYear()
        break

      case '%y':
        ans = _this.getFullYear() % 100
        break

      case '%C':
        ans = _this.getFullYear() / 100
        break

      case '%m':
      case '%n':
        ans = _this.getMonth() + 1
        break

      case '%B':
      case '%b':
        const m = _this.getMonth()
        ans = const_humanize_data.monthes[local][m]
        break

      case '%d':
      case '%e':
        ans = _this.getDate()
        break

      case '%j':
        ans = _this.getDaysOfYear()
        break

      case '%U':
      case '%W':
        const ws = _this.getWeeksOfYear(f === '%W')
        ans = padZero(ws, 2)
        break

      case '%w':
        ans = _this.getDay()

      case '%u':
        ans = ans === 0 ? 7 : ans
        break

      case '%A':
      case '%a':
        const d = _this.getDay()
        ans = const_humanize_data.weekdays[local][d]
        break

      case '%H':
      case '%k':
        ans = _this.getHours()
        break

      case '%I':
      case '%l':
        ans = _this.getHours()
        ans = ans % 12
        break

      case '%M':
        ans = _this.getMinutes()
        break

      case '%S':
        ans = _this.getSeconds()
        break

      case '%s':
        ans = parseInt(_this.getTime() / 1E3)
        break

      case '%f':
        const ms = _this.getMilliseconds()
        ans = padZero(ms * 1E3, 6)
        break

      case '%P':
        local = local.startsWith('en') ? 'english' : local

      case '%p':
        const h = _this.getHours()
        ans = const_humanize_data.meridians[local][h < 12 ? 0 : 1]
        break

      case '%z':
        let tzo = _this.getTimezoneOffset()
        const sign = tzo < 0 ? '-' : '+'
        tzo = Math.abs(tzo)
        const ho = padZero(tzo / 60, 2)
        const mo = padZero(tzo % 60, 2)
        ans = sign + ho + mo
        break

      default:
        break
    }
    if (f === '%C' || f === '%y' || f === '%m' || f === '%d' || f === '%H' || f === '%M' || f === '%S') {
      ans = padZero(ans, 2)
    }
    return ans.toString()
  })
}

// 个性化日期
Date.prototype.humanize = function() {
  const result = this.strftime('')
  const now = Date.now()
  // 当前时间与this时间的差值 秒
  const diff = (now - this.getTime()) / 1000
  const labels = const_humanize_data.humanizes['zh']
  let lbl = ''
  if (diff <= const_humanize_data.minute) {
    lbl = labels[0]
  } else if (diff <= const_humanize_data.hour) {
    lbl = Math.round(diff / const_humanize_data.minute) + labels[1]
  } else if (diff <= const_humanize_data.day) {
    lbl = Math.round(diff / const_humanize_data.hour) + labels[2]
  } else if (diff <= (const_humanize_data.day * 2)) {
    lbl = labels[3]
  } else if (diff <= (const_humanize_data.day * 7)){
    lbl = Math.round(diff / const_humanize_data.day) + labels[4]
  } else {
    lbl = result
  }
  return lbl
}

Date.prototype.simpleHumanize = function() {
  const result = this.strftime('')
  const now = Date.now()
  // 当前时间与this时间的差值 秒
  const diff = (now - this.getTime()) / 1000
  const labels = const_humanize_data.simpleHumanizes['zh']
  let lbl = ''
  if (diff <= const_humanize_data.day) {
    lbl = labels[0] + this.strftime('%H:%M')
  } else if (diff <= (const_humanize_data.day * 2)) {
    lbl = labels[1] + this.strftime('%H:%M')
  } else {
    lbl = result
  }
  return lbl
}

const const_humanize_data = {
  minute: 60, hour: 3600, day: 3600 * 24, week: 3600 * 24 * 7,
  monthes: {
    zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },
  weekdays: {
    zh: ['日', '一', '二', '三', '四', '五', '六']
  },
  meridians: {
    zh: ['上午', '下午']
  },
  humanizes: {
    zh: ['刚刚', ' 分钟前', ' 小时前', '昨天', ' 天前']
  },
  simpleHumanizes: {
    zh: ['今天', '昨天']
  } 
}

export default Date
