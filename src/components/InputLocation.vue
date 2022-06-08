<script setup>
import 'leaflet/dist/leaflet.css'
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { computed, nextTick, ref } from 'vue'
import { getLocationAsync } from '../helpers/geolocation'

const maxZoom = 19
const minZoom = 2
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const url = 'https://a.tile.openstreetmap.de/{z}/{x}/{y}.png'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [0, 0],
  },
})

const emit = defineEmits(['update:modelValue'])

// holds a template reference to LMap
const map = ref(null)

const zoom = ref(18)

// sets v-model up
const geoLocation = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

async function onMapReady() {
  geoLocation.value = await getLocationAsync()
  nextTick(() => {
    map.value.leafletObject.flyTo(geoLocation.value, maxZoom)
  })
}
</script>

<template>
  <LMap
    ref="map"
    :center="geoLocation"
    :zoom="zoom"
    :max-zoom="maxZoom"
    :min-zoom="minZoom"
    style="height: 40vh; width: 90vw"
    @ready="onMapReady"
    @update:zoom="zoom = $event"
    @update:center="geoLocation = [$event.lat, $event.lng]"
  >
    <LMarker :lat-lng="modelValue" />
    <LTileLayer :url="url" :attribution="attribution" />
  </LMap>
</template>
