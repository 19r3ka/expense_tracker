import { defineStore } from 'pinia'

const state = () => {
  return { expenses: [] }
}

const getters = {}

const actions = {
  save(expense) {
    // destructuring to lose reactivity otherwise all pushed items will be reactivly updated and the same expense will be added multiple times
    this.expenses.push({ ...expense })
  },
  // Seeds the store with data from backup
  seed(expenses) {
    this.expenses = expenses
  },
}

export default defineStore('expenses', { state, getters, actions })
