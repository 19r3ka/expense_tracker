<script setup>
import Moment from 'moment'
import { computed, reactive, ref } from 'vue'
import Divider from 'primevue/divider'

import ExpenseList from '../components/ExpenseList.vue'
import ExpenseListFilter from '../components/ExpenseListFilter.vue'
import ExpenseListItem from '../components/ExpenseListItem.vue'
import ExpenseListItemGroup from '../components/ExpenseListItemGroup.vue'
import ExpenseListPaginator from '../components/ExpenseListPaginator.vue'
import ExpensesMonthlySummary from '../components/ExpensesMonthlySummary.vue'
import useExpenseStore from '../stores/expenses.store.js'
import useAnalyticsStore from '../stores/analytics.store.js'

const expenseStore = useExpenseStore()
const analyticsStore = useAnalyticsStore()
const latestExpense = expenseStore.latest.at(-1)
const datetime = Moment.unix(latestExpense.datetime)
const activeDate = reactive({
  year: datetime.get('year'),
  month: datetime.get('month') + 1,
})

// the categories which expenses are in view
let activeCategories = ref([])

const expenses = computed(() =>
  expenseStore.getByDate(activeDate.year, activeDate.month)
)

const filteredExpenses = computed(() =>
  expenses.value.filter((expense) =>
    activeCategories.value.includes(expense.category)
  )
)

// return the right monthly summary for the given date (year + month)
const monthlyReports = computed(() =>
  analyticsStore.get(activeDate.year, activeDate.month)
)

// updates the activeDate whenever the date is updated in ListPaginator
const onDateChanged = ({ key, value }) => (activeDate[key] = value)

// updates the activeCategories whenever the categories are updated in ListFilter
const onCategoriesChanged = (categories) =>
  (activeCategories.value = categories)
</script>

<template>
  <div id="expenses-list" class="page">
    <ExpenseListPaginator
      :active-date="activeDate"
      @update:date="onDateChanged"
    />

    <ExpensesMonthlySummary :report="monthlyReports" />

    <ExpenseListFilter
      :active-categories="activeCategories"
      :expenses="expenses"
      @update:categories="onCategoriesChanged"
    />

    <ExpenseList :expenses="filteredExpenses">
      <template #itemgroup="{ displayTag, itemList }">
        <ExpenseListItemGroup
          v-slot="{ items }"
          :legend="displayTag"
          :items="itemList"
        >
          <div v-for="(item, index) in items" :key="index">
            <ExpenseListItem :item="item" />
            <Divider v-if="index < items.length - 1" />
          </div>
        </ExpenseListItemGroup>
      </template>
    </ExpenseList>
  </div>
</template>
