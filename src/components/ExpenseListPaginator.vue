<script setup>
import { computed } from 'vue'
import useExpenseStore from '../stores/expenses.store'
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

const expenseStore = useExpenseStore()

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

const { monthsByYearMap } = expenseStore

// There is expense data for previous year
const isPreviousYear = computed(() => activeYear.value - 1 in monthsByYearMap)

// There is expense data for next year
const isNextYear = computed(() => activeYear.value + 1 in monthsByYearMap)

// There is expense data for last month
const isPreviousMonth = computed(() => {
  const monthIndex = monthsByYearMap[activeYear.value].findIndex(
    (month) => month === activeMonth.value
  )
  return monthIndex >= 0 || isPreviousYear.value
})

// There is expense data for next month
const isNextMonth = computed(() => {
  const monthIndex = monthsByYearMap[activeYear.value].findIndex(
    (month) => month === activeMonth.value
  )
  const monthsArrayLength = monthsByYearMap[activeYear.value].length

  return monthIndex < monthsArrayLength - 1 || isNextYear.value
})

// properly formats the year and month for display
const displayDate = computed(() =>
  moment(`${activeYear.value}-${activeMonth.value}`, 'YYYY-MM').format(
    'MMMM YYYY'
  )
)

// Updates the active month value and also the active year value when needed
const changeMonth = (month) => {
  if (month === activeMonth.value) return

  const currentMonthIndex = monthsByYearMap[activeYear.value].findIndex(
    (val) => val === activeMonth.value
  )

  let newMonthIndex =
    month > activeMonth.value ? currentMonthIndex + 1 : currentMonthIndex - 1

  if (newMonthIndex >= monthsByYearMap[activeYear.value].length) {
    activeYear.value++
    newMonthIndex = 0
  }

  if (newMonthIndex < 0) {
    activeYear.value--
    newMonthIndex = -1
  }

  activeMonth.value = monthsByYearMap[activeYear.value].at(newMonthIndex)
}

// update the active year value and the active month value accordingly when required
const changeYear = (year) => {
  if (year === activeYear.value) return

  const newMonthIndex = year > activeYear.value ? 0 : -1
  activeYear.value += year > activeYear.value ? 1 : -1
  const newYearMonths = monthsByYearMap[activeYear.value]

  if (!newYearMonths.includes(activeMonth.value)) {
    activeMonth.value = newYearMonths.at(newMonthIndex)
  }
}
</script>

<template>
  <div class="flex flex-column bg-white">
    <div class="flex justify-content-center align-items-center">
      <Button
        icon="pi pi-angle-double-left"
        class="p-button-rounded p-button-text mr-2"
        :disabled="!isPreviousYear"
        @click="changeYear(activeYear - 1)"
      ></Button>
      <Button
        icon="pi pi-angle-left"
        class="p-button-rounded p-button-text mr-2"
        :disabled="!isPreviousMonth"
        @click="changeMonth(activeMonth - 1)"
      ></Button>

      <p class="m-0">{{ displayDate }}</p>

      <Button
        icon="pi pi-angle-right"
        class="p-button-rounded p-button-text ml-2"
        :disabled="!isNextMonth"
        @click="changeMonth(activeMonth + 1)"
      ></Button>
      <Button
        icon="pi pi-angle-double-right"
        class="p-button-rounded p-button-text ml-2"
        :disabled="!isNextYear"
        @click="changeYear(activeYear + 1)"
      ></Button>
    </div>
  </div>
</template>
