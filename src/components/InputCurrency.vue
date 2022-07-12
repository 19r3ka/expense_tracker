<script setup>
import { computed } from 'vue'
import currencies from '../config/currency'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ currency: '', code: '' }),
  },
})

const emits = defineEmits(['update:modelValue'])

const currency = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', value)
  },
})
</script>

<template>
  <Dropdown
    v-model="currency"
    :options="currencies"
    option-label="currency"
    :multiple="false"
    :filter="true"
    list-style="max-height:25px"
    style="width: '100%'"
    filter-placeholder="Search"
  />
</template>
