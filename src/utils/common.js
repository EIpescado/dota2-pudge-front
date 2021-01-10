import store from '@/store'

export function getFieldArray(rows, key) {
  const array = []
  if (rows && rows.length > 0) {
    rows.forEach(row => {
      array.push(row[key])
    })
  }
  return array
}

export function getIdArray(rows) {
  return getFieldArray(rows, 'id')
}

// 转化字典值
export function transferValueForArray(dictType, val) {
  const array = store.getters.dictSelectData[dictType]
  if (array && array.length > 0) {
    const length = array.length
    let current
    for (let i = 0; i < length; i++) {
      current = array[i]
      if (current.value === val || current.value === val.toString()) {
        return current.label
      }
    }
  }
  return val
}

export function getDictSelectData(dictType) {
  return new Promise(resolve => {
    const dictSelectData = store.getters.dictSelectData
    const haveData = dictSelectData && dictSelectData[dictType] && dictSelectData[dictType].length > 0
    if (!haveData) {
      store.dispatch('common/GetDictByDictType', dictType).then(res => resolve(res))
    } else {
      resolve(dictSelectData[dictType])
    }
  })
}

export function getDataInArrayByKeyEq(val, array, key) {
  if (!array || array.length === 0) {
    return
  }
  let currentValue = ''
  const haveKey = key && key.length > 0
  let result
  for (let i = 0; i < array.length; i++) {
    console.log('过滤', array[i])
    currentValue = haveKey ? array[i][key] : array[i]
    if (currentValue === val) {
      result = array[i]
      break
    }
  }
  return result
}
