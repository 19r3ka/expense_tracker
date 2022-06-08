<script setup>
import AppHeader from './components/AppHeader.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <div id="app-shell" class="h-screen w-screen">
    <Toast position="bottom-center" />
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
