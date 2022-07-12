import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import currencyList from '../config/currency'

const state = () => ({ settings: useStorage('scrooge-settings', {}) })

const getters = {
  currentCurrency: (state) =>
    state.settings.currency ||
    currencyList.find((currency) => currency.code === 'XOF'),
}
const actions = {
  setCurrency(currency) {
    this.settings.currency = currency
  },
}

export default defineStore('settings', { state, getters, actions })
