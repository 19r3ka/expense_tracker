<script setup>
import { computed, ref } from 'vue'
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

const legendIcon = computed(() =>
  expanded.value ? 'pi pi-minus' : 'pi pi-plus'
)

const expanded = ref(true)
</script>

<template>
  <div class="container bg-white">
    <Divider align="left">
      <Button
        class="p-button-text"
        :icon="legendIcon"
        :label="props.tag"
        @click="expanded = !expanded"
      />
    </Divider>
    <Transition
      enter-active-class="animate__animated animate__bounceInDown animate__faster"
      leave-active-class="animate__animated animate__bounceOutUp animate__faster"
    >
      <div v-show="expanded" class="p-2">
        <slot :items="props.items" />
      </div>
    </Transition>
  </div>
</template>
