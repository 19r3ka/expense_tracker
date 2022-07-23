<script setup>
import { computed, ref } from 'vue'
import Moment from 'moment'
import { useRouter } from 'vue-router'
import useRemindersStore from '../stores/reminders.store'
import Carousel from 'primevue/carousel'
import Button from 'primevue/button'

const remindersStore = useRemindersStore()
const router = useRouter()
const reminders = computed(() => remindersStore.all)

const remindersLength = computed(() => reminders.value.length)
const hasReminders = computed(() => remindersLength.value > 0)
const headerText = computed(() => {
  if (hasReminders.value) {
    return `You have ${remindersLength.value} ${
      remindersLength.value === 1 ? 'reminder' : 'reminders'
    }`
  } else {
    return 'No reminders'
  }
})

const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 3,
  },
  {
    breakpoint: '600px',
    numVisible: 2,
    numScroll: 2,
  },
  {
    breakpoint: '480px',
    numVisible: 1,
    numScroll: 1,
  },
])

const deleteReminder = (reminder) => {
  remindersStore.remove(reminder.id)
}

const formatDate = (timestamp) => {
  return Moment(timestamp).format('LLL')
}

const toNewExpensePage = (reminder) => {
  const route = {
    name: 'NewExpensePage',
    query: { r: reminder.id },
  }
  router.push(route)
}
</script>

<template>
  <div id="new-reminder-page" class="page w-full bg-white">
    <div
      v-if="!hasReminders"
      class="w-screen h-screen flex flex-column justify-content-center align-items-center bg-white p-2 text-center text-gray-500"
    >
      <h1>Good job!</h1>
      <h2>All reminders have been cleared</h2>
    </div>

    <Carousel
      v-else
      :value="reminders"
      :responsive-options="responsiveOptions.value"
      class="mt-4"
    >
      <template #header>
        <div class="p-3">
          <h1 class="text-xl font-bold text-800">{{ headerText }}</h1>
        </div>
      </template>
      <template #item="{ data: reminder }">
        <div class="container flex flex-wrap justify-content-center">
          <img
            class="h-auto w-9 p-0 m-0"
            :src="reminder.picture"
            alt="reminder image"
          />

          <div class="w-full grid my-3">
            <div class="text-700 pl-2 col-8">
              <p class="text-sm">{{ formatDate(reminder.date) }}</p>
            </div>

            <div class="col-4 flex justify-content-end">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-outlined p-button-text p-button-info p-button-lg"
                @click="toNewExpensePage(reminder)"
              ></Button>
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-outlined p-button-danger"
                @click="deleteReminder(reminder)"
              ></Button>
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}
</style>
