import Moment from 'moment'
import { uuid } from './expense'
import { isValidGeolocation } from './geolocation'
import currencyList from '../config/currency'
import { defaultValues } from '../config/expense'

// regex to target commas except those within quotes
const columnSeparator = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g
const headerSeperator = ','
const rowSeparator = '\n'
const airtableDatetimeFormat = 'M/DD/YYYY h:mma'

// renames Airtable headers to match the local expense schema
const renameAirtableHeaders = (header) => {
  switch (header) {
    case 'Short Description':
      return 'description'
    case 'Total':
      return 'amount'
    case 'Date & Time':
      return 'datetime'
    case 'Receipt Photo':
      return 'receipt'
    default:
      return header.toLowerCase()
  }
}

// only keeps numeric values from string
const parseNumeric = (string) => Number(string.replace(/[^0-9]/g, ''))

// only keeps alphabetic values from string
const parseAlpha = (string) => string.replace(/[^(a-zA-Z)]/g, '')

// regex that removes opening and clothing quotes
const parseQuotes = (string) => string.replace(/"(.*)"/g, '$1')

// turn a CSV data into an array of objects
export function csvToArrayOfObjects(csv) {
  const lines = csv.split(rowSeparator)
  const headers = lines[0].split(headerSeperator, -1).map(renameAirtableHeaders)
  const data = lines.slice(1).map((line) => {
    const row = line.split(columnSeparator, -1)
    const expense = row.reduce((obj, value, index) => {
      const header = headers[index]

      // do nothing is header is not a valid expense property
      if (!Object.keys(defaultValues).includes(header)) return obj

      value = parseQuotes(value.trim())

      switch (header) {
        case 'amount':
          obj.currency = currencyList.find(
            (currency) => currency.code === parseAlpha(value)
          )
          value = parseNumeric(value)
          break
        case 'category':
          value = value.toLowerCase()
          break
        case 'location':
          value = isValidGeolocation(value)
            ? value.split(headerSeperator).map(Number)
            : defaultValues.location
          break
        case 'datetime':
          value = Moment(value, airtableDatetimeFormat).unix()
      }
      obj[headers[index]] = value
      return obj
    }, {})

    expense.id = uuid()
    expense.createdAt = expense.updatedAt = Moment().unix()

    return expense
  })
  return data
}
