import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { uuid } from '../helpers/expense'

import useAnalyticsStore from './analytics.store'

const analyticsStore = useAnalyticsStore()

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
}

const actions = {
  // Add new expense to store
  add(expense) {
    expense.createdAt = Date.now()
    expense.id = uuid()
    this.expenses.push({ ...expense })
    analyticsStore.increaseTotals(expense)
  },

  // remove expense with specified id from store
  delete(expenseId) {
    const recordToDeleteIndex = this.expenses.findIndex(
      (expense) => expense.id === expenseId
    )

    if (recordToDeleteIndex < 0) throw new Error('Expense not found')

    const [deletedAmount] = this.expenses.splice(recordToDeleteIndex, 1)
    analyticsStore.decreaseTotals(deletedAmount)
  },

  // Update record with expenseId if it exists with data
  update(data) {
    const recordToUpdateIndex = this.expenses.findIndex(
      (expense) => expense.id === data.id
    )

    if (recordToUpdateIndex < 0) throw new Error('Expense not found')

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
