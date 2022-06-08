<script setup>
import { defineProps, ref } from 'vue'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  tag: {
    type: String,
    default: '',
  },
})

const expanded = ref(true)
</script>

<template>
  <div class="container bg-white">
    <Divider align="left">
      <Button
        v-if="expanded"
        class="p-button-text"
        icon="pi pi-minus"
        :label="props.tag"
        @click="expanded = false"
      />
      <Button
        v-else
        class="p-button-text"
        icon="pi pi-plus"
        :label="props.tag"
        @click="expanded = true"
      />
    </Divider>
    <div class="p-2">
      <slot v-if="expanded" :items="props.items" />
    </div>
  </div>
</template>
