<script setup>
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

// holds a reference to the confirm popup service instance
const confirmService = useConfirm()

// holds a reference to the menu component
const menuEl = ref(null)

const itemId = computed(() => props.item.id)

// toggles the menu element
const toggleMenu = (event) => menuEl.value.toggle(event)

// deletes the expense item
const deleteRecord = () => {
  console.log('deleteRecord')
}

// shows the item deletion confirmation popup
const showDeleteConfirmation = (position) => {
  confirmService.require({
    header: 'Delete expense record',
    message: 'Are you sure you want to delete this expense record?',
    icon: 'pi pi-exclamation-triangle',
    position,
    accept: deleteRecord,
    acceptClass: 'p-button-outlined p-button-danger',
    rejectClass: 'p-button-text p-button-secondary',
  })
}

// configures the menu's items
// TODO: move to a dedicated config file
const menuOptions = [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    to: { name: 'ExpenseEditPage', params: { id: itemId.value } },
  },
  { separator: true },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => showDeleteConfirmation('bottom'),
  },
]
</script>

<template>
  <div class="container expense-list-item-menu flex justify-content-end">
    <Button class="p-button-text" icon="pi pi-ellipsis-h" @click="toggleMenu" />
    <Menu ref="menuEl" :model="menuOptions" :popup="true" />
  </div>
</template>
