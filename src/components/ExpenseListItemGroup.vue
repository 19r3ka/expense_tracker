<script setup>
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  legend: {
    type: String,
    default: '',
  },
})

// set the divider's icon according to the listgroup's expansion state
const legendIcon = computed(() =>
  expanded.value ? 'pi pi-minus' : 'pi pi-plus'
)

// flag to control the expansion of the listgroup
const expanded = ref(true)
</script>

<template>
  <div class="container bg-white">
    <Divider align="left">
      <Button
        class="p-button-text"
        :icon="legendIcon"
        :label="legend"
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
