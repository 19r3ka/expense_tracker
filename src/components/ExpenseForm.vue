<script setup>
import { computed, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import Dropdown from 'primevue/dropdown'
import InputCalendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputLocation from '../components/InputLocation.vue'
import InputCurrency from '../components/InputCurrency.vue'
import { categories, defaultValues } from '../config/expense'
import { expenseRules } from '../helpers/vuelidate'
import useSettingsStore from '../stores/settings.store'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => defaultValues,
  },
})

const emits = defineEmits(['update:modelValue'])

const { currentCurrency } = useSettingsStore()

const expense = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', value)
  },
})

const currencyChangeFlag = ref(false)
const currencyChangeMessage = computed(() =>
  currencyChangeFlag.value ? 'cancel currency change' : 'change currency'
)

const toggleCurrencyChange = () => {
  currencyChangeFlag.value = !currencyChangeFlag.value
  if (!currencyChangeFlag.value) expense.value.currency = currentCurrency
}

// const displayCurrency = computed(() => 'AFN')
const displayCurrency = computed(() =>
  expense.value.currency.code
    ? expense.value.currency.code
    : currentCurrency.code
)

const v$ = useVuelidate(expenseRules, expense)
</script>

<template>
  <form class="p-fluid mt-5">
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
          :currency="displayCurrency"
        />
        <label for="amount" class="text-xl capitalize">amount*</label>
      </div>
      <span v-if="v$.amount.$invalid">
        <span v-for="error in v$.amount.$errors" :key="error.$uid">
          <small class="p-error">{{ error.$message }}</small>
        </span>
      </span>
      <span>
        <Button
          :label="currencyChangeMessage"
          class="p-button-secondary p-button-text p-button-sm"
          @click="toggleCurrencyChange"
        ></Button>
      </span>
    </div>

    <!-- the currency selector dropdown -->
    <div class="field">
      <div v-show="currencyChangeFlag" class="control">
        <label for="currency" class="text-xl capitalize">currency*</label>
        <InputCurrency v-model="expense.currency" />
      </div>
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
        v-model="v$.location.$model"
        name="location"
        placeholder="Add a location"
        class="w-full"
      />
    </div>
  </form>
</template>

<style scoped>
.field {
  margin-bottom: 1.8rem;
}
</style>
