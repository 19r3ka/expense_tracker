<script setup>
import { computed } from 'vue'
import moment from 'moment'
import { padLeft } from '../helpers/date'
import { groupExpensesByDay } from '../helpers/expense'

const props = defineProps({
  expenses: {
    type: Array,
    default: () => [],
  },
})

// the month and year which data is in view
const activeDate = computed(() => {
  const expense = props.expenses[0]
  const datetime = moment.unix(expense.datetime)
  const expenseYear = datetime.get('year')
  const expenseMonth = datetime.get('month') + 1
  return { year: expenseYear, month: expenseMonth }
})

const expensesGroupedByDate = computed(() =>
  Object.entries(props.expenses.reduce(groupExpensesByDay, {})).sort(
    (a, b) => Number(b[0]) - Number(a[0])
  )
)

// properly format the date to use as legend for itemgroups
const formatItemGroupDisplayTag = (day) => {
  const date = `${activeDate.value.year}-${padLeft(
    activeDate.value.month
  )}-${padLeft(day)}`
  return moment(date).format('MMM DD')
}
</script>

<template>
  <div v-auto-animate>
    <div v-for="[day, itemList] in expensesGroupedByDate" :key="day">
      <slot
        name="itemgroup"
        v-bind="{ displayTag: formatItemGroupDisplayTag(day), itemList }"
      ></slot>
    </div>
  </div>
</template>
