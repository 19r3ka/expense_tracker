import Moment from 'moment'

// An expense object with default values
export const defaultValues = {
  category: null,
  amount: 0,
  currency: { currency: '', code: '' },
  datetime: null,
  description: '',
  location: [0, 0],
  receipt: '',
  createdAt: null,
  updatedAt: null,
}

// return a map of expense categories with associated id, name, icon and color
export const categories = [
  { name: 'clothing', id: 1, icon: 'checkroom', color: 'blue' },
  { name: 'entertainment', id: 2, icon: 'celebration', color: 'red' },
  { name: 'food', id: 3, icon: 'restaurant', color: 'indigo' },
  { name: 'gift / donation', id: 4, icon: 'redeem', color: 'teal' },
  {
    name: 'health & personal care',
    id: 5,
    icon: 'health_and_safety',
    color: 'green',
  },
  { name: 'household supply', id: 6, icon: 'microwave', color: 'cyan' },
  { name: 'housing', id: 7, icon: 'home', color: 'orange' },
  { name: 'personal', id: 8, icon: 'sentiment_satisfied', color: 'purple' },
  { name: 'transportation', id: 9, icon: 'directions_car', color: 'pink' },
  { name: 'utilities', id: 10, icon: 'bolt', color: 'bluegray' },
]

// generates a unique id for each expense using createObjectURL static method
export const uuid = () => {
  const tempUrl = URL.createObjectURL(new Blob()).toString()
  // get last part of url removing the prefix (e.g. 'blob:http://localhost:3000/')
  const id = tempUrl.split(/[:/]/g).pop()
  // release the blob and associated resources
  URL.revokeObjectURL(tempUrl)
  return id
}

// Takes an array of expenses and returns a map of year, month, and day totals including category totals
export const decreaseTotalsByAmount = async (acc, expense) => {
  const datetime = Moment(expense.datetime)
  const category = expense.category
  let amount = expense.amount

  const expenseYear = datetime.get('year')
  const expenseMonth = datetime.month() + 1
  const expenseDay = datetime.date()

  const year = acc[expenseYear]
  year.total -= amount
  year.category[category] -= amount

  const month = year.month[expenseMonth]
  month.total -= amount
  month.category[category] -= amount

  const day = month.day[expenseDay]
  day.total -= amount
  day.category[category] -= amount

  return acc
}

// Takes an array of expenses and returns a map of year, month, and day totals including category totals
export const increaseTotalsByAmount = async (acc, expense, toCurrency) => {
  const datetime = Moment(expense.datetime)
  const currency = expense.currency.code
  const category = expense.category
  let amount = expense.amount
  let decreasing = amount < 0 ? true : false // are we remove or adding to totals?

  const expenseYear = datetime.get('year')
  const expenseMonth = datetime.month() + 1
  const expenseDay = datetime.date()

  if (currency !== toCurrency) {
    amount = await convertCurrency(
      Math.abs(amount), // API only accepts positive amounts
      currency,
      toCurrency,
      datetime.format('YYYY-MM-DD')
    )
  }

  if (decreasing) amount *= -1 // make amount negative

  if (!(expenseYear in acc)) {
    acc[expenseYear] = { category: {}, month: {}, total: 0 }
  }
  const year = acc[expenseYear]
  year.total += amount
  year.category[category] = (year.category[category] || 0) + amount

  if (!(expenseMonth in year.month)) {
    year.month[expenseMonth] = { category: {}, day: {}, total: 0 }
  }
  const month = year.month[expenseMonth]
  month.total += amount
  month.category[category] = (month.category[category] || 0) + amount

  if (!(expenseDay in month.day)) {
    month.day[expenseDay] = { category: {}, total: 0 }
  }
  const day = month.day[expenseDay]
  day.total += amount
  day.category[category] = (day.category[category] || 0) + amount

  return acc
}

// converts an amount from one currency to another using remote API
export async function convertCurrency(amount, currency, toCurrency, date) {
  const endpoint = 'https://api.exchangerate.host/convert'

  const request = `${endpoint}?amount=${amount}&from=${currency}&to=${toCurrency}&date=${date}`

  const { result: convertedAmount } = await fetch(request).then((res) =>
    res.json()
  )

  if (!convertedAmount) throw new Error('Rate not found')
  return convertedAmount
}

// displays K or M for large numbers
export const formatNumber = (number) => {
  if (number < 1000) {
    return number
  } else if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}K`
  } else {
    return `${(number / 1000000).toFixed(1)}M`
  }
}

export const formatCurrency = (amount, currency) =>
  amount.toLocaleString(undefined, {
    style: 'currency',
    currency,
  })
