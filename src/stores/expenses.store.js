import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { uuid } from '../helpers/expense'

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

  // get all categories in store
  categories: (state) => state.categories,

  // get a specific expense by its id
  get: (state) => (expenseId) =>
    state.expenses.find((expense) => expense.id === expenseId),

  // format store data to CSV
  dataAsCsv: (state) => arrayToCsv(state.expenses),
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
