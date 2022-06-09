<script setup>
import ExpenseList from '../components/ExpenseList.vue'
import ExpenseListItem from '../components/ExpenseListItem.vue'
import ExpenseListItemGroup from '../components/ExpenseListItemGroup.vue'
import ExpenseListPaginator from '../components/ExpenseListPaginator.vue'
import Divider from 'primevue/divider'

const expenses = JSON.parse(localStorage.getItem('scrooge-expenses'))
</script>

<template>
  <div id="expenses-list" class="page">
    <ExpenseList :expenses="expenses">
      <template #paginator="{ records, activeDate, onDateChanged }">
        <ExpenseListPaginator
          :active-date="activeDate"
          :expenses="records"
          @update:date="onDateChanged"
        />
      </template>

      <template #itemgroup="{ key, itemList }">
        <ExpenseListItemGroup v-slot="{ items }" :tag="key" :items="itemList">
          <div v-for="(item, index) in items" :key="index">
            <ExpenseListItem :item="item" />
            <Divider v-if="index < items.length - 1" />
          </div>
        </ExpenseListItemGroup>
      </template>
    </ExpenseList>
  </div>
</template>
