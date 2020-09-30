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
