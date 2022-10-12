import { defineStore } from 'pinia'
import Moment from 'moment'
import { useStorage } from '@vueuse/core'
import { sortMonthsByYear, uuid } from '../helpers/expense'

import useAnalyticsStore from './analytics.store'
import useRemindersStore from './reminders.store'
import { arrayToCsv } from '../helpers/backup'

const analyticsStore = useAnalyticsStore()
const remindersStore = useRemindersStore()

const state = () => {
  return {
    expenses: useStorage('scrooge-expenses', []),
  }
}

const getters = {
  // get all expenses in store
  all: (state) => state.expenses,

  // format store data to CSV
  dataAsCsv: (state) => arrayToCsv(state.expenses),

  // get the latest expenses in store limited by 'limit' param
  latest: (state) => state.expenses.slice(-5),

  // get a specific expense by its id
  get: (state) => (expenseId) =>
    state.expenses.find((expense) => expense.id === expenseId),

  // filter expenses by year, month, day
  getByDate: (state) => (year, month, day) => {
    if (!year) return
    let lowerBound = Moment(String(year), 'YYYY')
    let upperBound = Moment(String(year + 1), 'YYYY')

    if (month) {
      lowerBound = Moment(String(`${year}-${month}`), 'YYYY-MM')
      upperBound = Moment(String(`${year}-${month + 1}`), 'YYYY-MM')
    }

    if (day) {
      lowerBound = Moment(String(`${year}-${month}-${day}`), 'YYYY-MM-DD')
      upperBound = Moment(String(`${year}-${month}-${day + 1}`), 'YYYY-MM-DD')
    }

    return state.expenses.filter((expense) =>
      Moment.unix(expense.datetime).isBetween(
        lowerBound,
        upperBound,
        undefined,
        '[)'
      )
    )
  },

  // map all expesenes' datetimes like {year: [months]}
  monthsByYearMap: (state) => state.expenses.reduce(sortMonthsByYear, {}),
}

const actions = {
  // Add new expense to store
  add(expense) {
    expense.createdAt = Date.now()
    if (!expense.id) expense.id = uuid()
    this.expenses.push({ ...expense })
    analyticsStore.increaseTotals(expense)
    remindersStore.remove(expense.id)
  },

  // remove expense with specified id from store
  delete(expenseId) {
    const recordToDeleteIndex = this.expenses.findIndex(
      (expense) => expense.id === expenseId
    )

    if (recordToDeleteIndex < 0)
      throw new Error(`Expense with id ${expenseId} does not exist`)

    const [deletedAmount] = this.expenses.splice(recordToDeleteIndex, 1)
    analyticsStore.decreaseTotals(deletedAmount)
  },

  // Update record with expenseId if it exists with data
  update(data) {
    const recordToUpdateIndex = this.expenses.findIndex(
      (expense) => expense.id === data.id
    )

    if (recordToUpdateIndex < 0)
      throw new Error(`Expense with id ${data.id} does not exist`)

    data.updatedAt = Date.now()
    this.expenses[recordToUpdateIndex] = data
  },

  // Seeds the store with data from backup
  seed(expenses) {
    this.expenses = expenses
    analyticsStore.resetTotals()
  },
}

export default defineStore('expenses', { state, getters, actions })
