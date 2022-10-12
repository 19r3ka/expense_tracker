<script setup>
import { computed, reactive, watch } from 'vue'
import Moment from 'moment'
import { useRouter } from 'vue-router'
import ExpenseForm from '../components/ExpenseForm.vue'
import useVuelidate from '@vuelidate/core'
import Button from 'primevue/button'
import { defaultValues } from '../config/expense'
import { expenseRules } from '../helpers/vuelidate'
import useExpenseStore from '../stores/expenses.store'
import useSettingsStore from '../stores/settings.store'
import useRemindersStore from '../stores/reminders.store'

const props = defineProps({
  reminderId: {
    type: String,
    default: '',
  },
})
const router = useRouter()
const expenseStore = useExpenseStore()
const { currentCurrency } = useSettingsStore()
const remindersStore = useRemindersStore()

let newExpense = reactive(defaultValues)
reset()

const isCurrentRoute = computed(
  () => router.currentRoute.value.name === 'NewExpensePage'
)

const v$ = useVuelidate(expenseRules, newExpense)

// resets the form
function reset() {
  const expense = reactive({ currency: currentCurrency })
  const reminder = remindersStore.get(props.reminderId)

  if (reminder) {
    const { date, id, location } = reminder
    expense.datetime = Moment(date).toDate() // convert timestamp to Date format accepted by primevue/calendar
    expense.id = id
    expense.location = location
  }

  newExpense = expense
}

// form submission handler function
function onFormSubmit(formIsValid) {
  if (formIsValid) {
    let category = newExpense.category.name
    let datetime = Moment(newExpense.datetime).unix()
    expenseStore.add({ ...newExpense, category, datetime })
    reset()
  }
}

watch(() => props.reminderId, reset)
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
        ></Button>
      </Teleport>
    </div>
  </div>
</template>
