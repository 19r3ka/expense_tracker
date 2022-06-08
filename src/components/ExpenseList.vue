<script setup>
import { computed, defineProps, ref } from 'vue'

const props = defineProps({
  expenses: {
    type: Object,
    default: () => ({}),
  },
})

const activeMonth = ref(new Date().getMonth())
const activeYear = ref(new Date().getFullYear())

const filteredExpenses = computed(
  () => props.expenses[activeYear.value][activeMonth.value] || []
)

const setYearAndMonth = ({ year, month }) => {
  activeYear.value = year
  activeMonth.value = month
}
</script>

<template>
  <div>
    <slot
      name="paginator"
      v-bind="{ records: props.expenses, filterDate: setYearAndMonth }"
    />

    <div v-for="(itemList, key) in filteredExpenses" :key="key">
      <slot name="itemgroup" v-bind="{ key, itemList }" />
    </div>
  </div>
</template>
