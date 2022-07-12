<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ExpenseForm from '../components/ExpenseForm.vue'
import useVuelidate from '@vuelidate/core'
import Button from 'primevue/button'
import { defaultValues } from '../helpers/expense'
import { expenseRules } from '../helpers/vuelidate'
import useExpenseStore from '../stores/expenses.store'
import useSettingsStore from '../stores/settings.store'

const router = useRouter()
const expenseStore = useExpenseStore()
const { currentCurrency } = useSettingsStore()

const newExpense = reset()
const isCurrentRoute = computed(
  () => router.currentRoute.value.name === 'NewExpensePage'
)

const v$ = useVuelidate(expenseRules, newExpense)

// resets the form
function reset() {
  return reactive({ ...defaultValues, currency: currentCurrency })
}

// form submission handler function
function onFormSubmit(formIsValid) {
  if (formIsValid) {
    newExpense.category = newExpense.category.name
    expenseStore.add(newExpense)
    reset()
  }
}
</script>

<template>
  <div id="new-expense-page" class="page p-3">
    <ExpenseForm v-model="newExpense" />

    <div v-if="isCurrentRoute" id="form-actions">
      <Teleport to="#quick-actions">
        <Button
          id="save-button"
          icon="pi pi-save"
          class="p-button-rounded p-button-text mr-2"
          label="Save"
          :disabled="v$.$invalid"
          @click="onFormSubmit(!v$.$invalid)"
        />
      </Teleport>
    </div>
  </div>
</template>
