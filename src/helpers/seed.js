import { uuid } from './expense'

const numberOfColumnsInValidRow = 6
const columnSeparator = ';'
const rowSeparator = '\r\n'

// a function that breaks csv data into an array of arrays
export const csvToArray = (csvData) => {
  const csvArray = csvData.split(rowSeparator)
  const csvArrayOfArrays = csvArray.map((row) => {
    return row.split(columnSeparator)
  })
  return csvArrayOfArrays
}

// turns Date string into timestamp
export const dateToTimestamp = (dateString) => {
  const date = new Date(dateString)
  return date.getTime()
}

// only keeps numeric values from string
export const keepNumeric = (string) => {
  const numericString = string.replace(/[^0-9]/g, '')
  return numericString
}

// only keeps alphabetic values from string
export const keepAlpha = (string) => string.replace(/[^(a-zA-Z)]/g, '')

// returns true if array has 5 elements
export const isValidRow = (row) => row.length === numberOfColumnsInValidRow

// format array but transforming 2nd and 3rd elements
export const formatArray = (array) => {
  const [date, time] = splitDateTime(array[2])
  const dateTime = `${date} ${formatTime(time)}`
  array[2] = dateToTimestamp(dateTime)
  array[3] = keepNumeric(array[3])
  array.push(keepAlpha(array[3]))

  return array
}

// seperate digits from am/pm in time
export const formatTime = (time) => {
  // save am/pm from string
  const amPm = time.slice(-2)

  // leave only hour and minute from 12 hour time
  const hourMinute = time.slice(0, -2)

  return `${hourMinute} ${amPm}`
}

// split date from time
export const splitDateTime = (dateTime) => {
  const dateTimeArray = dateTime.split(' ')
  const date = dateTimeArray[0]
  const time = dateTimeArray[1]

  return [date, time]
}

// skip header line
export const notHeaderRow = (row) =>
  !row.some((element) => element === 'datetime')

// turn array into object
export const arrayToObject = (array) => ({
  description: array[0],
  receipt: array[1],
  datetime: array[2],
  amount: Number(array[3]),
  category: array[4].toLowerCase(),
  location: array[5].split(',').map(Number), // convert string of geoData to array of numbers (lat, lng)
  currency: array[6],
  id: uuid(),
  createdAt: array[2],
  updatedAt: Date.now(),
})
