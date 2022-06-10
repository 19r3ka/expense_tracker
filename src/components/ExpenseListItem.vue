<script setup>
import { computed } from 'vue'
import moment from 'moment'
import { categories } from '../helpers/expense'
import ExpenseListItemMenu from './ExpenseListItemMenu.vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

// sets the default color shade for the icons
const colorShade = 200 //Todo: move this to a config file in a utils holder

// formats the expense amount to locale currency
const total = computed(() =>
  Number(props.item.amount).toLocaleString(undefined, {
    style: 'currency',
    currency: `${currency.value}`,
  })
)

// sets the currency to use for the expense total formatting
const currency = computed(() => props.item.currency || 'XOF')

// formats the expense timestamp to a human readable time format
const time = computed(() => moment(props.item.datetime).format('hh:mm a'))

// sets the category icon to use for the expense item
const iconColorClass = computed(
  () =>
    `text-${
      categories.find((item) => item.name === props.item.category).color
    }-${colorShade}`
)

// sets the color of the text for the category displayed on item
const textColorClass = computed(
  () =>
    `text-${
      categories.find((item) => item.name === props.item.category).color
    }-${colorShade * 2}`
)

// sets the category icon
const categoryIcon = computed(
  () => categories.find((item) => item.name === props.item.category).icon
)

// formats the item's description
const title = computed(() => capitalize(props.item.description))

// Capitalizes the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1) // todo: move this to a helper file
</script>

<template>
  <div class="grid p-1">
    <div class="col-2 flex align-items-center">
      <i
        class="material-icons text-5xl bg-surface-ground"
        :class="iconColorClass"
        >{{ categoryIcon }}</i
      >
    </div>

    <div class="col-6 flex flex-wrap">
      <p class="font-bold m-0 w-full text-600 text-sm">
        {{ title }}
      </p>
      <p class="m-0 mt-1 text-xs capitalize" :class="textColorClass">
        {{ props.item.category }}
      </p>
    </div>

    <div class="col-4 flex flex-column justify-content-between">
      <p class="text-red-400 text-right text-xs m-0">- {{ total }}</p>
      <p class="text-400 text-right text-xs m-0">{{ time }}</p>
      <ExpenseListItemMenu :item="props.item" />
    </div>
  </div>
</template>
