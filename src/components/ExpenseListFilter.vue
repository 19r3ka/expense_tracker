<script setup>
import { computed } from 'vue'
import MultiSelect from 'primevue/multiselect'

const props = defineProps({
  expenses: {
    type: Array,
    default: () => [],
  },
  activeCategories: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:categories'])

// modelValue-inspired computed p roperty for the active month
let selectedCategories = computed({
  get: () => props.activeCategories,
  set: (value) => {
    emits('update:categories', value)
  },
})

const categories = computed(() =>
  Array.from(new Set(props.expenses.map((expense) => expense.category))).sort()
)

selectedCategories.value = categories.value
</script>

<template>
  <div class="component pt-3">
    <MultiSelect
      v-model="selectedCategories"
      :options="categories"
      :option-label="(category) => category"
      class="w-full"
      :filter="true"
      display="chip"
      placeholder="Filter by category"
    />
  </div>
</template>
