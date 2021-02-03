import { all, create } from 'mathjs'

const config = {
  number: 'BigNumber', // 类型
  precision: 10 // 精度
}
const math = create(all, config)

export function add(a, b) {
  a = a ? math.bignumber(a) : 0
  b = b ? math.bignumber(b) : 0
  return parseFloat(math.add(math.bignumber(a), math.bignumber(b)))
}

export function mul(a, b) {
  a = a ? math.bignumber(a) : 0
  b = b ? math.bignumber(b) : 0
  return parseFloat(math.multiply(a, b))
}

export function divide(a, b) {
  a = a ? math.bignumber(a) : 0
  if (a === 0) {
    return 0
  }
  b = b ? math.bignumber(b) : 0
  return parseFloat(math.divide(a, b))
}
