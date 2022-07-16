<script setup>
import { computed, reactive, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { categories, defaultValues } from '../config/expense'
import { expenseRules } from '../helpers/vuelidate'
import { useVuelidate } from '@vuelidate/core'
import Button from 'primevue/button'
import ExpenseForm from '../components/ExpenseForm.vue'
import useExpenseStore from '../stores/expenses.store'

const updatedExpense = reactive({
  ...defaultValues,
})

const router = useRouter()
const route = useRoute()
const isCurrentRoute = computed(() => route.name === 'EditExpensePage')
onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    getExpense(to.params.id)
  }
})

const expenseStore = useExpenseStore()

const v$ = useVuelidate(expenseRules, updatedExpense)

getExpense(route.params.id)

// form submission handler function
function onFormSubmit(formIsValid) {
  if (formIsValid) {
    updatedExpense.category = updatedExpense.category.name
    expenseStore.update(updatedExpense)
  }
}

// get expense from Store
function getExpense(id) {
  const expense = expenseStore.get(id)
  if (!expense) router.push({ name: 'PageNotFound' })

  Object.assign(updatedExpense, expense, {
    datetime: new Date(expense.datetime),
    category: categories.find((category) => category.name === expense.category),
  })
}

// because components are cached with KeepAlive, need to manually update everytime
watch(
  () => route.params.id,
  (id) => {
    if (!id) return
    getExpense(id)
  }
)
</script>

<template>
  <div id="edit-expense" class="page">
    <ExpenseForm v-model="updatedExpense"></ExpenseForm>

    <div v-if="isCurrentRoute" id="form-actions">
      <Teleport to="#quick-actions">
        <Button
          id="update-button"
          icon="pi pi-save"
          class="p-button-rounded p-button-text mr-2"
          label="Update"
          :disabled="v$.$invalid"
          @click="onFormSubmit(!v$.$invalid)"
        />
      </Teleport>
    </div>
  </div>
</template>
