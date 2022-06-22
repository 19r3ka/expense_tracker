<script setup>
import { useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import AppHeader from './components/AppHeader.vue'
import useExpenseStore from './stores/expenses.store'
import { notification } from './helpers/notification'
import { storeActionMessageOptions } from './config/notification'

const toast$ = useToast()
const router = useRouter()
const expenseStore = useExpenseStore()

expenseStore.$onAction(({ name, after, onError }) => {
  after(() => {
    toast$.add(
      notification(storeActionMessageOptions[name].success, 'success', 3000)
    )
    router.push({ name: 'ExpensesPage' })
  })

  onError(() =>
    toast$.add(notification(storeActionMessageOptions[name].error, 'error'))
  )
})
</script>

<template>
  <div id="app-shell" class="h-screen w-screen">
    <Toast position="bottom-center" />
    <ConfirmDialog></ConfirmDialog>
    <AppHeader />

    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition mode="out-in">
          <KeepAlive>
            <Suspense>
              <!-- main content -->
              <component :is="Component"></component>

              <!-- loading state -->
              <template #fallback> Loading... </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
</style>
