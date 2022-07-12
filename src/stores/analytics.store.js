import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import useExpensesStore from './expenses.store'
import useSettingsStore from './settings.store'
import pinia from './index'
import { increaseTotalsByAmount } from '../helpers/expense'

const settingsStore = useSettingsStore(pinia)
const defaultCurrency = settingsStore.currentCurrency?.code

const state = () => {
  return {
    analytics: useStorage('scrooge-analytics', {}),
  }
}

const getters = {
  all: (state) => state.analytics,

  get: (state) => (year, month, day) => {
    let data = state.analytics[year]
    if (month) data = data.month[month]
    if (day) data = data.day[day]
    return data
  },
}

const actions = {
  // seeds the store with analyses of initial data
  async resetTotals() {
    const expensesStore = useExpensesStore()
    const expenses = expensesStore.all

    let totals = {}

    // used to notify users of skipped records during conversion
    // due to some API error or something
    const skippedExpenses = []

    // do nothing if no expenses
    if (!expenses.length) return

    for (const expense of expenses) {
      try {
        totals = await increaseTotalsByAmount(totals, expense, defaultCurrency)
      } catch (e) {
        console.log(e)
        skippedExpenses.push(expense)
      }
    }

    // const analytics = await expenses.reduce(await increaseTotalsByAmount, {})
    this.analytics = totals

    // TODO: notify user of skipped records
    if (skippedExpenses.length) {
      console.warn(`${skippedExpenses.length} expenses could not be converted`)
      console.warn(skippedExpenses)
    }
  },

  // increases year, month, and day total amounts by expense amount
  async increaseTotals(expense) {
    const newState = await increaseTotalsByAmount(
      this.analytics,
      expense,
      defaultCurrency
    )

    this.analytics = newState
  },

  // decrease year, month, and day total amounts by expense amount
  async decreaseTotals(expense) {
    expense.amount *= -1 // make amount negative
    this.analytics = await increaseTotalsByAmount(
      this.analytics,
      expense,
      defaultCurrency
    )
  },
}

export default defineStore('analytics', { state, getters, actions })
