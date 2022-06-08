<script setup>
import Button from 'primevue/button'
</script>

<template>
  <nav id="navbar" class="flex justify-content-between bg-white">
    <Button
      id="navbar-nav-button"
      icon="pi pi-arrow-left"
      class="p-button-rounded p-button-text"
      @click="$router.back()"
    />

    <h1
      id="navbar-page-title"
      class="capitalize font-light align-self-center justify-self-center text-secondary text-sm m-0"
    >
      {{ $route.meta.displayTitle }}
    </h1>
    <!-- Add page quick actions -->
    <div id="quick-actions"></div>
  </nav>
</template>

<style scoped>
justify-self-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
