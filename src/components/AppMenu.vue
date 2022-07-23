<script setup>
import TabMenu from 'primevue/tabmenu'

const views = [
  {
    to: { name: 'HomePage' },
    label: 'Home',
    icon: 'pi pi-home',
  },
  {
    to: { name: 'ExpensesPage' },
    label: 'Expenses',
    icon: 'pi pi-credit-card',
  },
  {
    to: { name: 'RemindersPage' },
    label: 'Reminders',
    icon: 'pi pi-bell',
  },
  {
    to: { name: 'SettingsPage' },
    label: 'Settings',
    icon: 'pi pi-fw pi-cog',
  },
]
</script>

<template>
  <nav class="component">
    <TabMenu :model="views">
      <template #item="{ item: { to, label, icon } }">
        <router-link
          :to="to"
          class="flex flex-column justify-content-center align-items-center m-1 p-2"
        >
          <i :class="icon"></i>
          <span class="mt-1">{{ label }}</span>
        </router-link>
      </template>
    </TabMenu>
  </nav>
</template>

<style scoped>
.router-link-active {
  color: var(--primary-color);
  font-weight: bold;
}
</style>
