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

export function getDictSelectData(dictType, that) {
  return new Promise(resolve => {
    const dictSelectData = that.$store.getters.dictSelectData
    const haveData = dictSelectData && dictSelectData[dictType] && dictSelectData[dictType].length > 0
    if (!haveData) {
      that.$store.dispatch('common/GetDictByDictType', dictType)
    }
    resolve()
  })
}
