<script setup>
import { computed, defineProps } from 'vue'
import { categories } from '../helpers/expense'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const colorShade = 200

const total = computed(() =>
  Number(props.item.amount).toLocaleString(undefined, {
    style: 'currency',
    currency: `${currency.value}`,
  })
)

const currency = computed(() => props.item.currency || 'XOF')

const iconColorClass = computed(
  () =>
    `text-${
      categories.find((item) => item.name === props.item.category).color
    }-${colorShade}`
)

const textColorClass = computed(
  () =>
    `text-${
      categories.find((item) => item.name === props.item.category).color
    }-${colorShade * 2}`
)
const categoryIcon = computed(
  () => categories.find((item) => item.name === props.item.category).icon
)
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
        {{ props.item.description }}
      </p>
      <p class="m-0 mt-1 text-xs" :class="textColorClass">
        {{ props.item.category }}
      </p>
    </div>

    <div class="col-4 flex flex-column">
      <p class="text-red-400 text-right text-xs m-0">- {{ total }}</p>
    </div>
  </div>
</template>
