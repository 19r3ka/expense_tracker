<script setup>
import Divider from 'primevue/divider'

import ExpenseList from '../components/ExpenseList.vue'
import ExpenseListFilter from '../components/ExpenseListFilter.vue'
import ExpenseListItem from '../components/ExpenseListItem.vue'
import ExpenseListItemGroup from '../components/ExpenseListItemGroup.vue'
import ExpenseListPaginator from '../components/ExpenseListPaginator.vue'
import ExpensesMonthlySummary from '../components/ExpensesMonthlySummary.vue'
import useExpenseStore from '../stores/expenses.store.js'

const expenseStore = useExpenseStore()
</script>

<template>
  <div id="expenses-list" class="page">
    <ExpenseList :expenses="expenseStore.all">
      <template #paginator="{ records, activeDate, onDateChanged }">
        <ExpenseListPaginator
          :active-date="activeDate"
          :expenses="records"
          @update:date="onDateChanged"
        />
      </template>

      <template #report="report">
        <ExpensesMonthlySummary :report="report" />
      </template>

      <template #filter="{ activeCategories, expenses, onCategoriesChanged }">
        <ExpenseListFilter
          :active-categories="activeCategories"
          :expenses="expenses"
          @update:categories="onCategoriesChanged"
        />
      </template>

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
