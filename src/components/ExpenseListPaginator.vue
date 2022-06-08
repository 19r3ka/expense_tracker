<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  expenses: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['filter:date'])

const previousYear = computed(() => {
  const prev = year.value - 1
  const res = years.includes(prev) ? prev : null
  return res
})

const previousMonth = computed(() => {
  const prev = month.value - 1
  const res = recordDates[year.value].includes(prev) ? prev : null
  return res
})

const nextYear = computed(() => {
  const next = year.value + 1
  const res = years.includes(next) ? next : null
  return res
})

const nextMonth = computed(() => {
  const next = month.value + 1
  const res = recordDates[year.value].includes(next) ? next : null
  return res
})

const sortMonthsByYear = (prev, [year, data]) => {
  const yearMonths = Object.keys(data).map(Number)
  prev[year] = yearMonths
  years.push(Number(year))
  return prev
}

const getPreviousYear = () => {
  year.value = previousYear.value
  month.value =
    month.value in recordDates[year.value]
      ? month.value
      : recordDates[year.value][0]

  emit('filter:date', { year: year.value, month: month.value })
}

const getNextYear = () => {
  year.value = nextYear.value
  month.value =
    month.value in recordDates[year.value]
      ? month.value
      : recordDates[year.value][0]

  emit('filter:date', { year: year.value, month: month.value })
}

const getPreviousMonth = () => {
  month.value = previousMonth.value

  emit('filter:date', { year: year.value, month: month.value })
}

const getNextMonth = () => {
  month.value = nextMonth.value

  emit('filter:date', { year: year.value, month: month.value })
}

let years = []
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)

const recordDates = Object.entries(props.expenses).reduce(sortMonthsByYear, {})
</script>

<template>
  <div class="flex flex-column">
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

      <p class="m-0">{{ month }} {{ year }}</p>

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
