<script setup>
import { computed, ref } from 'vue'
import { categories } from '../helpers/expense'
import { addTransparency, colorHex } from '../helpers/color'
import Chart from 'primevue/chart'

const props = defineProps({
  expenses: {
    type: Object,
    default: () => {},
  },
})

// returns dailyExpenses from [day, dailyExpenses]
const getDailyExpenses = (record) => record[1]

// turns all expenses into a single list of expenses
const flattenExpenses = (acc, expense) => {
  acc.push(...expense)
  return acc
}

// reduces the array of expenses to get the total amount of expenses
const getTotalExpenses = (total, expense) => total + expense.amount

// filters the expenses according to given category
const filterExpensesByCategory = (category) => (expense) =>
  expense.category === category

// computes total amount of expenses per category
const totalAmountByCategory = computed(() => {
  // get all expenses into one single list
  const allExpenses = props.expenses
    .map(getDailyExpenses)
    .reduce(flattenExpenses, [])

  return categories
    .map((category) => category.name)
    .reduce(
      (acc, category) => ({
        ...acc,
        [category]: allExpenses
          .filter(filterExpensesByCategory(category))
          .reduce(getTotalExpenses, 0),
      }),
      {}
    )
})

const labels = computed(() => Object.keys(totalAmountByCategory.value))
const data = computed(() => Object.values(totalAmountByCategory.value))
const borderColor = computed(() =>
  labels.value.map(
    (label) =>
      colorHex[categories.find((category) => category.name === label).color]
  )
)
const backgroundColor = computed(() =>
  borderColor.value.map(addTransparency(50))
)

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Expenses',
      data: data.value,
      backgroundColor: backgroundColor.value,
      borderColor: borderColor.value,
      borderWidth: 1,
      borderRadius: 100,
      barThickness: 10,
    },
  ],
}))

const options = ref({
  scales: {
    grid: {
      display: false,
    },
    x: [
      {
        display: false,
        gridLines: {
          display: false,
        },
      },
    ],
    y: [
      {
        display: false,
        gridLines: {
          display: false,
        },
      },
    ],
  },
})
</script>

<template>
  <div>
    <Chart type="bar" :data="chartData" :options="options" />
  </div>
</template>
