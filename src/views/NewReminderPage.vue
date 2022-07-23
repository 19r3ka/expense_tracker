<script setup>
import { useGeolocation } from '@vueuse/core'
import AppCamera from '../components/AppCamera.vue'
import { uuid } from '../helpers/expense'
import UseRemindersStore from '../stores/reminders.store'

const remindersStore = UseRemindersStore()
const { coords, error } = useGeolocation()

// saves the reminder to the store with a unique id
const onSnapshot = (photoUrl) => {
  if (error.value) {
    throw error
  }

  const { latitude, longitude } = coords.value

  const reminder = {
    id: uuid(),
    picture: photoUrl,
    date: Date.now(),
    location: [latitude, longitude],
  }
  remindersStore.add(reminder)
}
</script>

<template>
  <div id="new-reminder-page" class="page w-full">
    <AppCamera @snapshot="onSnapshot" />
  </div>
</template>
