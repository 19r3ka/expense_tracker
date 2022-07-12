<script setup>
import { computed, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { padLeft } from '../helpers/date'
import { groupExpensesByDate } from '../helpers/date'
import useAnalyticsStore from '../stores/analytics.store'

const props = defineProps({
  expenses: {
    type: Array,
    default: () => [],
  },
})

const analyticsStore = useAnalyticsStore()

// the month and year which data is in view
const activeDate = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
})

// the categories which expenses are in view
const activeCategories = ref([])

// return the right monthly summary for the given date (year + month)
const monthlyReports = computed(() =>
  analyticsStore.get(activeDate.year, activeDate.month)
)

const expensesGroupedByDate = computed(() =>
  props.expenses.reduce(groupExpensesByDate, {})
)

// defines the animate.css transitions to use when changing the active date's records view
const transitionDirection = {
  left: {
    enterClass: 'animate__fadeInRight',
    leaveClass: 'animate__fadeOutLeft',
  },
  right: {
    enterClass: 'animate__fadeInLeft',
    leaveClass: 'animate__fadeOutRight',
  },
}

const transitionConstants = 'animate__animated animate__faster'

const transistionActive = reactive({
  enterClass: 'animate__fadeIn',
  leaveClass: 'animate__fadeOut',
})

watch(
  [() => activeDate.month, () => activeDate.year],
  ([newMonth, newYear], [oldMonth, oldYear]) => {
    if (newMonth !== oldMonth || newYear !== oldYear) {
      const direction =
        newMonth < oldMonth || newYear < oldYear ? 'right' : 'left'

      transistionActive.enterClass =
        transitionConstants + ' ' + transitionDirection[direction].enterClass
      transistionActive.leaveClass =
        transitionConstants + ' ' + transitionDirection[direction].leaveClass
    }
  }
)

// get the daily records corresponding to the active year and month
const monthlyExpenses = computed(
  () => expensesGroupedByDate.value[activeDate.year][activeDate.month] || {}
)

// sort the daily records object by descending day
const expensesByDescDay = computed(() =>
  Object.entries(monthlyExpenses.value).sort((a, b) => b[0] - a[0])
)

// filters the expenses taking into account the active categories
const filteredExpenses = computed(() =>
  expensesByDescDay.value.reduce((acc, [day, expenses]) => {
    const filteredExpenses = expenses.filter((expense) =>
      activeCategories.value.includes(expense.category)
    )

    if (filteredExpenses.length) acc.push([day, filteredExpenses])

    return acc
  }, [])
)

// properly format the date to use as legend for itemgroups
const formatItemGroupDisplayTag = (day) => {
  const date = `${activeDate.year}-${padLeft(activeDate.month)}-${padLeft(day)}`
  return moment(date).format('MMM DD')
}

// updates the activeDate whenever the date is updated in ListPaginator
const onDateChanged = ({ key, value }) => (activeDate[key] = value)

// updates the activeCategories whenever the categories are updated in ListFilter
const onCategoriesChanged = (categories) =>
  (activeCategories.value = categories)
</script>

<template>
  <div>
    <slot
      name="paginator"
      v-bind="{
        records: expensesGroupedByDate,
        activeDate,
        onDateChanged,
      }"
    ></slot>

    <slot v-bind="monthlyReports" name="report" />

    <slot
      v-bind="{
        activeCategories,
        onCategoriesChanged,
        expenses: expensesByDescDay,
      }"
      name="filter"
    ></slot>

    <TransitionGroup
      :enter-active-class="transistionActive.enterClass"
      :leave-active-class="transistionActive.leaveClass"
    >
      <div v-for="[day, itemList] in filteredExpenses" :key="day">
        <slot
          name="itemgroup"
          v-bind="{ displayTag: formatItemGroupDisplayTag(day), itemList }"
        ></slot>
      </div>
    </TransitionGroup>
  </div>
</template>
