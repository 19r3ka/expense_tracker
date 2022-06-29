<script setup>
import { computed } from 'vue'
import MultiSelect from 'primevue/multiselect'

const props = defineProps({
  expenses: {
    type: Object,
    default: () => {},
  },
  activeCategories: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:categories'])

// modelValue-inspired computed property for the active month
const activeCategories = computed({
  get: () => props.activeCategories,
  set: (value) => {
    emits('update:categories', value)
  },
})

const categories = computed(() =>
  Array.from(
    new Set(
      props.expenses
        .map((entry) => entry[1].map((expense) => expense.category))
        .reduce((acc, expense) => {
          acc.push(...expense)
          return acc
        }, [])
    )
  )
)

// make sure all the expenses are shown by default
activeCategories.value = categories.value
</script>

<template>
  <div class="component pt-3">
    <MultiSelect
      v-model="activeCategories"
      :options="categories"
      :option-label="(category) => category"
      class="w-full"
      :filter="true"
      display="chip"
      placeholder="Filter by category"
    />
  </div>
</template>
