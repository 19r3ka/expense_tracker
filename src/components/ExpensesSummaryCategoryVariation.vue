<script setup>
import { computed } from 'vue'
import { categories } from '../config/expense'
import { formatCurrency } from '../helpers/expense'

const colorShade = 300

const props = defineProps({
  category: { type: String, default: '' },
  currency: { type: String, default: 'XOF' },
  variation: { type: Number, default: 0 },
})

// sets the category icon to use for the expense item
const iconColorClass = computed(
  () =>
    `text-${
      categories.find((item) => item.name === props.category).color
    }-${colorShade}`
)

// sets the category icon
const categoryIcon = computed(
  () => categories.find((item) => item.name === props.category).icon
)

// formats the item's description
const title = computed(() => capitalize(props.category))

// flags if expense variation is positive
const spentLess = computed(() => props.variation <= 0)

// formats the variation to display to user
const variationToDisplay = computed(() => {
  const sign = spentLess.value ? '-' : '+'
  const absoluteVariation = formatCurrency(
    Math.abs(props.variation),
    props.currency
  )
  return ` ${sign} ${absoluteVariation}`
})

// sets the color for the variation
const variationColorClass = computed(
  () => `text-${spentLess.value ? 'green' : 'red'}-${colorShade * 2}`
)

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

    <div class="col-5 flex flex-wrap">
      <p class="font-bold m-0 w-full text-600 text-sm">
        {{ title }}
      </p>
      <p class="m-0 mt-1 text-xs capitalize">total expense goes here</p>
    </div>

    <div class="col-5 flex flex-column justify-content-between">
      <p class="text-right text-sm m-0" :class="variationColorClass">
        {{ variationToDisplay }}
      </p>
    </div>
  </div>
</template>
