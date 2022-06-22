<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import moment from 'moment'

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

// modelValue-inspired computed property for the active month
const activeMonth = computed({
  get: () => props.activeDate.month,
  set: (value) => {
    emit('update:date', { key: 'month', value })
  },
})

// modelValue-inspired computed property for the active year
const activeYear = computed({
  get: () => props.activeDate.year,
  set: (value) => {
    emit('update:date', { key: 'year', value })
  },
})

// gets the previous year on record if any
const previousYear = computed(() => {
  const prev = activeYear.value - 1
  const res = years.includes(prev) ? prev : null
  return res
})

// gets the next year on record if any
const previousMonth = computed(() => {
  const prev = activeMonth.value - 1
  const res = recordDates[activeYear.value].includes(prev) ? prev : null
  return res
})

// gets the next year on record if any
const nextYear = computed(() => {
  const next = activeYear.value + 1
  const res = years.includes(next) ? next : null
  return res
})

// gets the next year on record if any
const nextMonth = computed(() => {
  const next = activeMonth.value + 1
  const res = recordDates[activeYear.value].includes(next) ? next : null
  return res
})

// properly formats the year and month for display
const displayDate = computed(() =>
  moment(`${activeYear.value}-${activeMonth.value}`, 'YYYY-MM').format(
    'MMMM YYYY'
  )
)

// reduces array like [year, year's data] to object with records' years as key and array of record months per year as value
const sortMonthsByYear = (prev, [year, data]) => {
  const yearMonths = Object.keys(data).map(Number)
  prev[year] = yearMonths
  years.push(Number(year))
  return prev
}

// sets the previous year on record as the active year
const getPreviousYear = () => {
  activeYear.value = previousYear.value
  activeMonth.value =
    activeMonth.value in recordDates[activeYear.value]
      ? activeMonth.value
      : recordDates[activeYear.value].at(-1)
}

// sets the next year on record as the active year
const getNextYear = () => {
  activeYear.value = nextYear.value
  activeMonth.value =
    activeMonth.value in recordDates[activeYear.value]
      ? activeMonth.value
      : recordDates[activeYear.value].at(-1)
}

// sets the previous month on record as the active month
const getPreviousMonth = () => {
  activeMonth.value = previousMonth.value
}

// sets the next month on record as the active month
const getNextMonth = () => {
  activeMonth.value = nextMonth.value
}

let years = []

// creates an object with records' years as key and array of record months per year as value
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

      <p class="m-0">{{ displayDate }}</p>

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
