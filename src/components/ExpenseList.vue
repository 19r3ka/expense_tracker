<script setup>
import { computed, reactive } from 'vue'

const props = defineProps({
  expenses: {
    type: Object,
    default: () => ({}),
  },
})

const activeDate = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
})

// watch(
//   [() => activeMonth.value, () => activeYear.value],
//   ([newMonth, newYear], [oldMonth, oldYear]) => {
//     console.log(`${oldYear}-${oldMonth} -> ${newYear}-${newMonth}`)
//   }
// )

// get the daily records corresponding to the active year and month
const filteredExpenses = computed(
  () => props.expenses[activeDate.year][activeDate.month] || []
)

// sort the daily records object by descending day
const expensesByDescDay = computed(() =>
  Object.entries(filteredExpenses.value).sort((a, b) => b[0] - a[0])
)

// updates the activeDate whenever the date is updated in ListPaginator
const onDateChanged = ({ key, value }) => (activeDate[key] = value)
</script>

<template>
  <div>
    <slot
      name="paginator"
      v-bind="{
        records: props.expenses,
        activeDate,
        onDateChanged,
      }"
    />

    <TransitionGroup
      enter-active-class="animate__animated animate__bounceInLeft animate__faster"
      leave-active-class="animate__animated animate__bounceOutRight animate__faster"
    >
      <div v-for="[key, itemList] in expensesByDescDay" :key="key">
        <slot name="itemgroup" v-bind="{ key, itemList }" />
      </div>
    </TransitionGroup>
  </div>
</template>
