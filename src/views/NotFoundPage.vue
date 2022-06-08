<script setup>
import Button from 'primevue/button'
</script>
<template>
  <div
    id="404-page"
    class="page grid justify-content-center align-items-center h-screen w-screen"
  >
    <h1 class="col-12 text-8xl text-center text-green-500">404</h1>
    <p class="col-12 text-2xl text-center">
      Congratulations! You've managed to lose track of your money. 🤑
    </p>
    <Button
      class="p-button-rounded uppercase text-xl"
      @click="$router.push({ name: 'Home' })"
      >Go back to my money</Button
    >
  </div>
</template>
