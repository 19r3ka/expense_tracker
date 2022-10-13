<script setup>
import { toRefs } from 'vue'
const props = defineProps({
  label: {
    type: String,
    default: 'Total',
  },
  amount: {
    type: String,
    default: '0',
  },
  period: {
    type: String,
    default: 'today',
  },
})

const supportTextClass = 'text-base text-500 font-normal'
const { label, amount, period } = toRefs(props)
</script>

<template>
  <div class="container text-center">
    <h1 class="pb-0 mb-0" :class="supportTextClass">{{ label }}</h1>
    <h2 class="text-5xl text-primary p-0 m-0">
      {{ amount }}
    </h2>
    <h1 class="pt-0 mt-0" :class="supportTextClass">{{ period }}</h1>
  </div>
</template>
