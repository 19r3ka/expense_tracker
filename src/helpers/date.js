import Moment from 'moment'

const monthAsDigitformat = 'M'
const dayFormat = 'D'
const yearFormat = 'YYYY'

// Groups the expenses by year then month then day
export const groupExpensesByDate = (prev, curr) => {
  const recordDate = Moment.unix(curr.datetime)
  const day = recordDate.format(dayFormat)
  const month = recordDate.format(monthAsDigitformat)
  const year = recordDate.format(yearFormat)

  if (!(year in prev)) prev[year] = {}
  if (!(month in prev[year])) prev[year][month] = {}
  if (!(day in prev[year][month])) prev[year][month][day] = []

  prev[year][month][day].push(curr)

  return prev
}

// format number to two digits
export const padLeft = (num) => (num < 10 ? `0${num}` : num)
