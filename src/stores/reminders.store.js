import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const state = () => ({ reminders: useStorage('scrooge-reminders', []) })

const actions = {
  // adds a reminder to the store
  add(data) {
    this.reminders.push(data)
  },

  // removes a reminder from the store
  remove(id) {
    if (!this.get(id)) throw new Error(`Reminder with id ${id} does not exist`)
    this.reminders = this.reminders.filter((reminder) => reminder.id !== id)
  },
}

const getters = {
  // get all reminders
  all: (state) => state.reminders,

  // get a specific reminder by id
  get: (state) => (id) =>
    state.reminders.find((reminder) => reminder.id === id),
}

export default defineStore('reminders', { state, getters, actions })
