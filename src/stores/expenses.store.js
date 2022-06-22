import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { uuid } from '../helpers/expense'

const state = () => {
  return { expenses: useStorage('scrooge-expenses', []) }
}

const getters = {
  // get all expenses in store
  all: (state) => state.expenses,

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
  },

  // remove expense with specified id from store
  delete(expenseId) {
    const recordToDeleteIndex = this.expenses.findIndex(
      (expense) => expense.id === expenseId
    )

    if (recordToDeleteIndex < 0) throw new Error('Expense not found')

    this.expenses.splice(recordToDeleteIndex, 1)
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
  },
}

export default defineStore('expenses', { state, getters, actions })
