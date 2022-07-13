import currencies from '../config/currency'

let columnSeparator = ';'
const rowSeparator = '\n'

// convert array of objects to csv file
export function arrayToCsv(array) {
  columnSeparator = array.some((obj) =>
    Object.values(obj).some((val) => String(val).includes(','))
  )
    ? ';'
    : ','
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

  return [csv_header, csv_body].join('')
}

// convert csv file to array of objects
export function csvToObjectArrays(csv) {
  const lines = csv.split(rowSeparator)
  const headers = lines[0].split(columnSeparator)

  const data = lines.slice(1).map((line) => {
    const obj = {}
    const values = line.split(columnSeparator)
    headers.forEach((header, index) => {
      let value = values[index]

      switch (header) {
        case 'currency':
          value = currencies.find(({ code }) => code === values[index])
          break

        case 'location':
          value = value.split(',').map(Number)
          break

        case 'datetime':
        case 'amount':
          value = Number(value)
          break

        default:
          value = String(value)
          break
      }

      obj[header] = value
    })

    obj.createdAt = obj.updatedAt = Date.now()
    return obj
  })
  return data
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
