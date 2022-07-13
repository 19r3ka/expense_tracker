// convert array of objects to csv file
export function arrayToCsv(array) {
  const columnSeparator = array.some((obj) =>
    Object.values(obj).some((val) => String(val).includes(','))
  )
    ? ';'
    : ','
  const rowSeparator = '\n'
  const columnsOfInterest = [
    'datetime',
    'amount',
    'category',
    'description',
    'currency',
    'location',
  ]
  const headers = Object.keys(array[0]).filter((key) =>
    columnsOfInterest.includes(key)
  )

  const rows = array.map((obj) =>
    headers.map((key) => (key === 'currency' ? obj[key].code : obj[key]))
  )
  const csv_header = headers.join(columnSeparator).concat(rowSeparator)
  const csv_body = rows
    .map((row) => row.join(columnSeparator))
    .join(rowSeparator)

  return [csv_header, csv_body]
}

// downloads csv file to user device
export function downloadCsv(csv) {
  const csvFile = new Blob([csv], { type: 'text/csv' })
  const csvUrl = URL.createObjectURL(csvFile)
  const link = document.createElement('a')
  link.href = csvUrl
  link.download = 'scrooge_transactions.csv'
  link.click()
  URL.revokeObjectURL(csvUrl)
}
