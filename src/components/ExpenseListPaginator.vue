<script setup>
import { computed, defineEmits } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  expenses: {
    type: Object,
    default: () => ({}),
  },

  activeDate: {
    type: Object,
    default: () => ({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    }),
  },
})

const emit = defineEmits(['update:date'])

const activeMonth = computed({
  get: () => props.activeDate.month,
  set: (value) => {
    emit('update:date', { key: 'month', value })
  },
})

const activeYear = computed({
  get: () => props.activeDate.year,
  set: (value) => {
    emit('update:date', { key: 'year', value })
  },
})

const previousYear = computed(() => {
  const prev = activeYear.value - 1
  const res = years.includes(prev) ? prev : null
  return res
})

const previousMonth = computed(() => {
  const prev = activeMonth.value - 1
  const res = recordDates[activeYear.value].includes(prev) ? prev : null
  return res
})

const nextYear = computed(() => {
  const next = activeYear.value + 1
  const res = years.includes(next) ? next : null
  return res
})

const nextMonth = computed(() => {
  const next = activeMonth.value + 1
  const res = recordDates[activeYear.value].includes(next) ? next : null
  return res
})

const sortMonthsByYear = (prev, [year, data]) => {
  const yearMonths = Object.keys(data).map(Number)
  prev[year] = yearMonths
  years.push(Number(year))
  return prev
}

const getPreviousYear = () => {
  activeYear.value = previousYear.value
  activeMonth.value =
    activeMonth.value in recordDates[activeYear.value]
      ? activeMonth.value
      : recordDates[activeYear.value].at(-1)
}

const getNextYear = () => {
  activeYear.value = nextYear.value
  activeMonth.value =
    activeMonth.value in recordDates[activeYear.value]
      ? activeMonth.value
      : recordDates[activeYear.value].at(-1)
}

const getPreviousMonth = () => {
  activeMonth.value = previousMonth.value
}

const getNextMonth = () => {
  activeMonth.value = nextMonth.value
}

let years = []
const recordDates = Object.entries(props.expenses).reduce(sortMonthsByYear, {})
</script>

<template>
  <div class="flex flex-column bg-white">
    <div class="flex justify-content-center align-items-center">
      <Button
        icon="pi pi-angle-double-left"
        class="p-button-rounded p-button-text mr-2"
        :disabled="!previousYear"
        @click="getPreviousYear"
      />
      <Button
        icon="pi pi-angle-left"
        class="p-button-rounded p-button-text mr-2"
        :disabled="!previousMonth"
        @click="getPreviousMonth"
      />

      <p class="m-0">{{ activeMonth }} {{ activeYear }}</p>

      <Button
        icon="pi pi-angle-right"
        class="p-button-rounded p-button-text ml-2"
        :disabled="!nextMonth"
        @click="getNextMonth"
      />
      <Button
        icon="pi pi-angle-double-right"
        class="p-button-rounded p-button-text ml-2"
        :disabled="!nextYear"
        @click="getNextYear"
      />
    </div>
  </div>
</template>
