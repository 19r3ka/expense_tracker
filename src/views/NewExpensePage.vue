<script setup>
import { reactive, toRef } from 'vue'
import useVuelidate from '@vuelidate/core'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputCalendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import InputLocation from '../components/InputLocation.vue'
import { categories, defaultValues } from '../helpers/expense'
import { expenseRules } from '../helpers/vuelidate'
import useExpense from '../stores/expenses.store'
import { persistToLocalStorage } from '../helpers/pinia'

const newExpense = reactive(defaultValues)
const location = toRef(newExpense, 'location')

const expenseStore = useExpense()
expenseStore.$subscribe(persistToLocalStorage)

const toast$ = useToast()
const v$ = useVuelidate(expenseRules, newExpense)

function onFormSubmit(formIsValid) {
  if (formIsValid) {
    newExpense.category = newExpense.category.name
    expenseStore.save(newExpense)
    // Object.assign(newExpense, defaultValues)
    toast$.add({
      severity: 'success',
      summary: 'Success',
      detail: `Expense saved!`,
      life: 3000,
    })
  } else {
    toast$.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to save expense!`,
      life: 3000,
    })
  }
}
</script>

<template>
  <div id="new-expense-page" class="page p-3">
    <form class="p-fluid mt-5" @submit.prevent="onFormSubmit(!v$.$invalid)">
      <!-- the "amount" input -->
      <div class="field">
        <div class="p-float-label">
          <InputNumber
            id="amount"
            v-model="v$.amount.$model"
            class="w-full"
            :class="{ 'p-invalid': v$.amount.$invalid }"
            name="amount"
            :min="0"
            :step="25"
            :use-grouping="true"
            show-buttons
            button-layout="horizontal"
            decrement-button-class="p-button-danger"
            increment-button-class="p-button-success"
            increment-button-icon="pi pi-plus"
            decrement-button-icon="pi pi-minus"
            mode="currency"
            currency="XOF"
          />
          <label for="amount" class="text-xl capitalize">amount*</label>
        </div>
        <span v-if="v$.amount.$invalid">
          <span v-for="error in v$.amount.$errors" :key="error.$uid">
            <small class="p-error">{{ error.$message }}</small>
          </span>
        </span>
      </div>

      <!-- the "category" dropdown -->
      <div class="field">
        <div class="p-float-label">
          <Dropdown
            id="category"
            v-model="v$.category.$model"
            class="w-full"
            name="category"
            :options="categories"
            option-label="name"
          />
          <label for="category" class="text-xl capitalize">category*</label>
        </div>
        <span v-if="v$.category.$error">
          <span v-for="error in v$.category.$errors" :key="error.$uid">
            <small class="p-error">{{ error.$message }}</small>
          </span>
        </span>
      </div>

      <!-- the "datetime" calendar widget and input -->
      <div class="field">
        <div class="p-float-label">
          <InputCalendar
            id="date"
            v-model="v$.datetime.$model"
            name="date"
            :show-icon="true"
            :show-time="true"
            class="w-full"
          />
          <label for="date" class="text-xl capitalize">date and time*</label>
        </div>
        <span v-if="v$.datetime.$invalid">
          <span v-for="error in v$.datetime.$errors" :key="error.$uid">
            <small class="p-error">{{ error.$message }}</small>
          </span>
        </span>
      </div>

      <!-- the "description" input -->
      <div class="field">
        <div class="p-float-label">
          <InputText
            id="description"
            v-model="v$.description.$model"
            class="w-full"
            name="description"
          />
          <label for="description" class="text-xl capitalize"
            >short description*</label
          >
        </div>
        <span v-if="v$.description.$invalid">
          <span v-for="error in v$.description.$errors" :key="error.$uid">
            <small class="p-error">{{ error.$message }}</small>
          </span>
        </span>
      </div>

      <div class="field">
        <label for="location" class="text-xl capitalize">location</label>
        <InputLocation
          id="location"
          v-model="location"
          name="location"
          placeholder="Add a location"
          class="w-full"
        />
      </div>
    </form>

    <div id="form-actions">
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

<style scoped>
.field {
  margin-bottom: 1.8rem;
}
</style>
