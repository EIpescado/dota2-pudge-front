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
      if (current.value === val) {
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
