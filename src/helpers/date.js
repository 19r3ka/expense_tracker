import date from 'moment'

const monthAsDigitformat = 'M'
const dayFormat = 'D'
const yearFormat = 'YYYY'

export const sortObjectsByDate = (prev, curr) => {
  const recordDate = date(curr.datetime)
  const day = recordDate.format(dayFormat)
  const month = recordDate.format(monthAsDigitformat)
  const year = recordDate.format(yearFormat)

  if (!(year in prev)) prev[year] = {}
  if (!(month in prev[year])) prev[year][month] = {}
  if (!(day in prev[year][month])) prev[year][month][day] = []

  prev[year][month][day].push(curr)

  return prev
}
