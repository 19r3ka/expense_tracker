import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import Moment from 'moment'

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
  // get all analytics in store
  all: (state) => state.analytics,

  // get analytics for a specific year, month, day
  get: (state) => (year, month, day) => {
    let data = state.analytics[year]
    if (month) data = data?.month[month]
    if (day) data = data?.day[day]
    return data || { category: {}, total: 0 }
  },

  dailyVariation(state) {
    const [prevYear, prevMonth, prevDay] = Moment()
      .subtract(1, 'days')
      .toArray()
    const [year, month, day] = Moment().toArray()
    const dayCategories =
      state.analytics[year]?.month[month + 1]?.day[day]?.category
    const prevDayCategories =
      state.analytics[prevYear]?.month[prevMonth + 1]?.day[prevDay]?.category
    const variationByCategory = {}

    if (dayCategories) {
      Object.entries(dayCategories).forEach(([categoryName, amount]) => {
        if (!(categoryName in variationByCategory))
          variationByCategory[categoryName] = 0
        variationByCategory[categoryName] += amount
      })
    }

    if (prevDayCategories) {
      Object.entries(prevDayCategories).forEach(([categoryName, amount]) => {
        if (!(categoryName in variationByCategory))
          variationByCategory[categoryName] = 0
        variationByCategory[categoryName] -= amount
      })
    }

    return variationByCategory
  },

  monthlyVariation(state) {
    const [year, month] = Moment().toArray()
    const [prevYear, prevMonth] = Moment().subtract(1, 'months').toArray()

    const monthCategories = state.analytics[year]?.month[month + 1]?.category
    const prevMonthCategories =
      state.analytics[prevYear]?.month[prevMonth + 1]?.category
    const variationByCategory = {}

    if (monthCategories) {
      Object.entries(monthCategories).forEach(([categoryName, amount]) => {
        if (!(categoryName in variationByCategory))
          variationByCategory[categoryName] = 0
        variationByCategory[categoryName] += amount
      })
    }

    if (prevMonthCategories) {
      Object.entries(prevMonthCategories).forEach(([categoryName, amount]) => {
        if (!(categoryName in variationByCategory))
          variationByCategory[categoryName] = 0
        variationByCategory[categoryName] -= amount
      })
    }

    return variationByCategory
  },

  yearlyVariation(state) {
    const [year] = Moment().toArray()
    const [prevYear] = Moment().subtract(1, 'years').toArray()

    const yearCategories = state.analytics[year]?.category
    const prevYearCategories = state.analytics[prevYear]?.category
    const variationByCategory = {}

    if (yearCategories) {
      Object.entries(yearCategories).forEach(([categoryName, amount]) => {
        if (!(categoryName in variationByCategory))
          variationByCategory[categoryName] = 0
        variationByCategory[categoryName] += amount
      })
    }

    if (prevYearCategories) {
      Object.entries(prevYearCategories).forEach(([categoryName, amount]) => {
        if (!(categoryName in variationByCategory))
          variationByCategory[categoryName] = 0
        variationByCategory[categoryName] -= amount
      })
    }

    return variationByCategory
  },

  todayHourlySummary(state) {
    const [year, month, day] = Moment().toArray()
    const hourlySummary = new Array(24).fill(0)
    const dailyData = state.analytics[year]?.month[month + 1]?.day[day]

    if (!dailyData) return {}

    return Object.entries(dailyData.hour).reduce(
      (categories, [hour, { category }]) => {
        Object.entries(category).forEach(([categoryName, amount]) => {
          if (!categories[categoryName])
            categories[categoryName] = [...hourlySummary]
          categories[categoryName][Number(hour)] += amount
        })
        return categories
      },
      {}
    )
  },

  thisMonthDailySummary(state) {
    const [year, month] = Moment().toArray()
    // dailySummary is a empty array of month days length filled with 0
    const dailySummary = new Array(Moment().daysInMonth()).fill(0)
    const monthlyData = state.analytics[year]?.month[month + 1]

    if (!monthlyData) return {}

    return Object.entries(monthlyData.day).reduce(
      (categories, [day, { category }]) => {
        Object.entries(category).forEach(([categoryName, amount]) => {
          if (!categories[categoryName])
            categories[categoryName] = [...dailySummary]
          categories[categoryName][Number(day)] += amount
        })
        return categories
      },
      {}
    )
  },

  thisYearMonthlySummary(state) {
    const [year] = Moment().toArray()
    // dailySummary is a empty array of month days length filled with 0
    const monthlySummary = new Array(12).fill(0)
    const yearlyData = state.analytics[year]

    if (!yearlyData) return {}

    return Object.entries(yearlyData.month).reduce(
      (categories, [month, { category }]) => {
        Object.entries(category).forEach(([categoryName, amount]) => {
          if (!categories[categoryName])
            categories[categoryName] = [...monthlySummary]
          // "month - 1" converts month from 1-12 to 0-11
          categories[categoryName][Number(month - 1)] += amount
        })
        return categories
      },
      {}
    )
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
