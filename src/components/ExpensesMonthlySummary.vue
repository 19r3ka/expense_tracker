<script setup>
import { computed } from 'vue'
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

// displays K or M for large numbers
const formatNumber = (number) => {
  if (number < 1000) {
    return number
  } else if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}K`
  } else {
    return `${(number / 1000000).toFixed(1)}M`
  }
}

// returns the icon corresponding to category
const getCategoryIcon = (category) =>
  categories.find((c) => c.name === category).icon

// get the color for the category
const getCategoryColorName = (category) =>
  categories.find((c) => c.name === category).color

// returns the color for the category icon
const colorizedText = (category) => `text-${getCategoryColorName(category)}-300`

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

  // a list of unique categories of expenses
  const allCategories = Array.from(
    new Set(allExpenses.map((expense) => expense.category))
  )

  const totalAmounts = allCategories.reduce(
    (acc, category) => ({
      ...acc,
      [category]: allExpenses
        .filter(filterExpensesByCategory(category))
        .reduce(getTotalExpenses, 0),
    }),
    {}
  )

  // sorts the categories by total amount descending
  return Object.entries(totalAmounts)
    .sort((entryA, entryB) => entryB[1] - entryA[1])
    .reduce(
      (acc, entry) => ({
        ...acc,
        [entry[0]]: entry[1],
      }),
      {}
    )
})

// computes the total amount of expenses
const totalAmount = computed(() => {
  const allExpenses = props.expenses
    .map(getDailyExpenses)
    .reduce(flattenExpenses, [])

  const total = allExpenses.reduce(getTotalExpenses, 0)

  return total.toLocaleString(undefined, {
    style: 'currency',
    currency: `XOF`,
  })
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
  borderColor.value.map(addTransparency(40))
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
      cutout: '80%',
      radius: '90%',
    },
  ],
}))

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<template>
  <div class="grid p-2 m-1 bg-white">
    <div id="chart" class="col-9">
      <Chart type="doughnut" :data="chartData" :options="options" />
      <p class="overlay text-xl text-red-300">- {{ totalAmount }}</p>
    </div>

    <div id="chart-legend" class="col grid pt-4 pr-3">
      <div
        v-for="(amount, category) in totalAmountByCategory"
        :key="category"
        class="col-12 grid p-0"
      >
        <div class="icon col-4 text-xs">
          <i class="material-icons" :class="colorizedText(category)">{{
            getCategoryIcon(category)
          }}</i>
        </div>

        <div class="total col-8">
          <p class="m-0 text-right text-700">
            {{ formatNumber(amount) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* vertically center text */
p {
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

div {
  padding: 4px;
}

div#chart-legend {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.overlay {
  position: relative;
  top: -50%;

  width: 100%;
  text-align: center;
  margin: auto;
  z-index: 1;
}
</style>
