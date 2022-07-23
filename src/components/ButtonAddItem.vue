<script setup>
import SpeedDial from 'primevue/speeddial'
import { useRouter } from 'vue-router'

const router = useRouter()

const actions = [
  {
    icon: 'pi pi-plus',
    tooltip: 'New expense',
    command: () => {
      router.push({ name: 'NewExpensePage' })
    },
  },
  {
    icon: 'pi pi-camera',
    tooltip: 'Reminder pic',
    command: () => {
      router.push({ name: 'NewReminderPage' })
    },
  },
]
</script>

<template>
  <SpeedDial :model="actions" />
</template>
