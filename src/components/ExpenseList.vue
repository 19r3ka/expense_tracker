<script setup>
import { computed, reactive, watch } from 'vue'
import moment from 'moment'
import { padLeft } from '../helpers/date'

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

const transitionDirection = {
  left: {
    enterClass: 'animate__bounceInRight',
    leaveClass: 'animate__bounceOutLeft',
  },
  right: {
    enterClass: 'animate__bounceInLeft',
    leaveClass: 'animate__bounceOutRight',
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
    if (newMonth !== oldMonth || newYear !== oldMonth) {
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
const filteredExpenses = computed(
  () => props.expenses[activeDate.year][activeDate.month] || []
)

// sort the daily records object by descending day
const expensesByDescDay = computed(() =>
  Object.entries(filteredExpenses.value).sort((a, b) => b[0] - a[0])
)

// properly format the date to use as legend for itemgroups
const formatItemGroupDisplayTag = (day) => {
  const date = `${activeDate.year}-${padLeft(activeDate.month)}-${padLeft(day)}`
  return moment(date).format('MMM DD')
}

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
      :enter-active-class="transistionActive.enterClass"
      :leave-active-class="transistionActive.leaveClass"
    >
      <div v-for="[day, itemList] in expensesByDescDay" :key="day">
        <slot
          name="itemgroup"
          v-bind="{ displayTag: formatItemGroupDisplayTag(day), itemList }"
        />
      </div>
    </TransitionGroup>
  </div>
</template>
